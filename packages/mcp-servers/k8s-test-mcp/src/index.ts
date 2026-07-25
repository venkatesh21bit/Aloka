import { Module, Tool, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class K8sTestService {
  public async runSuite(suite: string, diff: string, ns: string): Promise<string> {
    return Sanitizer.scrub(`Started test suite ${suite} in ${ns} with patch: ${diff}`);
  }

  public async getStatus(runId: string): Promise<string> {
    return Sanitizer.scrub(`Test run ${runId}: PASSED`);
  }
}

@Module({ providers: [K8sTestService] })
export class K8sTestServer {
  constructor(private readonly k8sTestService: K8sTestService) {}

  @Tool({
    name: 'run_ephemeral_test_suite',
    description: 'Execute targeted integration tests in an ephemeral K8s pod',
    schema: z.object({
      suite_name: z.string(),
      patch_diff: z.string(),
      target_namespace: z.string().default('omnitrace-sandbox')
    })
  })
  async runEphemeralTestSuite(args: { suite_name: string, patch_diff: string, target_namespace: string }) {
    return await this.k8sTestService.runSuite(args.suite_name, args.patch_diff, args.target_namespace);
  }

  @Tool({
    name: 'get_test_execution_status',
    description: 'Polls running Testkube execution status',
    schema: z.object({ run_id: z.string() })
  })
  async getTestExecutionStatus(args: { run_id: string }) {
    return await this.k8sTestService.getStatus(args.run_id);
  }
}

NitroStack.start(K8sTestServer);
