import { Module, Tool, Resource, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class CIService {
  public async fetchFailedJobLogs(jobId: string, tailLines: number, filter?: string): Promise<string> {
    // Mock implementation for hackathon
    let rawLogs = `[INFO] Starting job ${jobId}\n[ERROR] Step failed with exit code 1\n[ERROR] NullPointerException in payment-service\n[INFO] Job finished`;
    if (filter) {
      rawLogs = rawLogs.split('\n').filter(l => l.includes(filter)).join('\n');
    }
    const lines = rawLogs.split('\n');
    const logs = lines.slice(Math.max(lines.length - tailLines, 0)).join('\n');
    return Sanitizer.scrub(logs);
  }

  public async fetchPipelineContext(runId: string): Promise<string> {
    return Sanitizer.scrub(JSON.stringify({
      run_id: runId,
      commit_sha: 'a1b2c3d4',
      author: 'dev@company.com',
      failing_job_id: 'job_456'
    }));
  }

  public async fetchRawLogs(runId: string): Promise<string> {
    return Sanitizer.scrub(`Raw logs for pipeline ${runId}: ...`);
  }
}

@Module({
  providers: [CIService]
})
export class CIServer {
  constructor(private readonly ciService: CIService) {}

  @Tool({
    name: 'get_failed_job_logs',
    description: 'Fetch log output for a failed CI job run',
    schema: z.object({
      job_id: z.string(),
      tail_lines: z.number().default(200),
      step_filter: z.string().optional()
    })
  })
  async getFailedJobLogs(args: { job_id: string, tail_lines: number, step_filter?: string }) {
    const logs = await this.ciService.fetchFailedJobLogs(args.job_id, args.tail_lines, args.step_filter);
    return logs.length > 4000 ? logs.substring(0, 4000) : logs;
  }

  @Tool({
    name: 'get_pipeline_context',
    description: 'Returns metadata associated with the build failure',
    schema: z.object({ run_id: z.string() })
  })
  async getPipelineContext(args: { run_id: string }) {
    return await this.ciService.fetchPipelineContext(args.run_id);
  }

  @Resource({
    uri: 'ci://pipeline/{run_id}/raw-logs',
    description: 'Read-only stream containing unredacted raw build logs'
  })
  async getRawLogs(uri: string, params: { run_id: string }) {
    return {
      contents: [{ uri, text: await this.ciService.fetchRawLogs(params.run_id) }]
    };
  }
}

NitroStack.start(CIServer);
