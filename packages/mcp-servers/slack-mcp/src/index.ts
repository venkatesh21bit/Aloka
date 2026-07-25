import { Module, Tool, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class SlackService {
  public async postAlert(channelId: string, summary: string, diff: string, traceUrl?: string, actions?: string[]): Promise<string> {
    const msg = `Posted alert to ${channelId}. Summary: ${summary}. Actions: ${actions?.join(',')}`;
    return Sanitizer.scrub(msg);
  }

  public async updateMessage(threadId: string, update: string): Promise<string> {
    return Sanitizer.scrub(`Updated thread ${threadId}: ${update}`);
  }
}

@Module({ providers: [SlackService] })
export class SlackServer {
  constructor(private readonly slackService: SlackService) {}

  @Tool({
    name: 'post_interactive_alert',
    description: 'Post interactive incident response card to Slack',
    schema: z.object({
      channel_id: z.string(),
      rca_summary: z.string(),
      diff_patch: z.string(),
      trace_url: z.string().optional(),
      action_buttons: z.array(z.string()).optional()
    })
  })
  async postInteractiveAlert(args: { channel_id: string, rca_summary: string, diff_patch: string, trace_url?: string, action_buttons?: string[] }) {
    return await this.slackService.postAlert(args.channel_id, args.rca_summary, args.diff_patch, args.trace_url, args.action_buttons);
  }

  @Tool({
    name: 'update_thread_message',
    description: 'Appends progress updates to an ongoing incident thread',
    schema: z.object({
      thread_id: z.string(),
      update_text: z.string()
    })
  })
  async updateThreadMessage(args: { thread_id: string, update_text: string }) {
    return await this.slackService.updateMessage(args.thread_id, args.update_text);
  }
}

NitroStack.start(SlackServer);
