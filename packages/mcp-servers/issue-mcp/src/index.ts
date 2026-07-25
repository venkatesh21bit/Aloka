import { Module, Tool, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class IssueService {
  public async createOrUpdate(project: string, title: string, desc: string, priority?: string, traceId?: string): Promise<string> {
    return Sanitizer.scrub(`Issue created/updated in ${project}: [${priority || 'P2'}] ${title}. Trace: ${traceId}`);
  }
}

@Module({ providers: [IssueService] })
export class IssueServer {
  constructor(private readonly issueService: IssueService) {}

  @Tool({
    name: 'create_or_update_issue',
    description: 'Create or update issue ticket in Linear/Jira',
    schema: z.object({
      project_key: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(['P0', 'P1', 'P2']).optional(),
      trace_id: z.string().optional()
    })
  })
  async createOrUpdateIssue(args: { project_key: string, title: string, description: string, priority?: 'P0' | 'P1' | 'P2', trace_id?: string }) {
    return await this.issueService.createOrUpdate(args.project_key, args.title, args.description, args.priority, args.trace_id);
  }
}

NitroStack.start(IssueServer);
