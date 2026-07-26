var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { SlackService } from './slack.service.js';
const slackService = new SlackService();
export class SlackTools {
    constructor() { }
    async postInteractiveAlert(args) {
        return await slackService.postAlert(args.channel_id, args.rca_summary, args.diff_patch, args.trace_url, args.action_buttons);
    }
    async updateThreadMessage(args) {
        return await slackService.updateMessage(args.channel_id, args.thread_ts, args.update_text);
    }
}
__decorate([
    Tool({
        name: 'post_interactive_alert',
        description: 'Post interactive incident response card to Slack',
        inputSchema: z.object({
            channel_id: z.string(),
            rca_summary: z.string(),
            diff_patch: z.string(),
            trace_url: z.string().optional(),
            action_buttons: z.array(z.string()).optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SlackTools.prototype, "postInteractiveAlert", null);
__decorate([
    Tool({
        name: 'update_thread_message',
        description: 'Appends progress updates to an ongoing incident thread',
        inputSchema: z.object({
            channel_id: z.string(),
            thread_ts: z.string(),
            update_text: z.string()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SlackTools.prototype, "updateThreadMessage", null);
//# sourceMappingURL=slack.tools.js.map