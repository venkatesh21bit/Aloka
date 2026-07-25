import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { IssueService } from './issue.service.js';

export class IssueTools {
  constructor(private readonly issueService: IssueService) {}

  @Tool({
    name: 'create_or_update_issue',
    description: 'Create or update issue ticket in Jira',
    inputSchema: z.object({
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
