var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';
import { WebClient } from '@slack/web-api';
let SlackService = class SlackService {
    client;
    constructor() {
        this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
    }
    async postAlert(channelId, summary, diff, traceUrl, actions) {
        try {
            const blocks = [
                {
                    type: "header",
                    text: { type: "plain_text", text: "🚨 Build Failure Detected" }
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*RCA Summary:*\n${summary}` }
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*Suggested Patch:*\n\`\`\`diff\n${diff}\n\`\`\`` }
                }
            ];
            if (traceUrl) {
                blocks.push({
                    type: "section",
                    text: { type: "mrkdwn", text: `<${traceUrl}|View Distributed Trace>` }
                });
            }
            if (actions && actions.length > 0) {
                blocks.push({
                    type: "actions",
                    elements: actions.map(a => ({
                        type: "button",
                        text: { type: "plain_text", text: a },
                        value: a
                    }))
                });
            }
            const res = await this.client.chat.postMessage({
                channel: channelId,
                text: "Build Failure Detected",
                blocks
            });
            return Sanitizer.scrub(`[SUCCESS] Message posted in ${channelId}. Thread ID: ${res.ts}`);
        }
        catch (e) {
            return `[ERROR] Slack API Error: ${e.message}`;
        }
    }
    async updateMessage(channelId, threadTs, update) {
        try {
            await this.client.chat.postMessage({
                channel: channelId,
                thread_ts: threadTs,
                text: update
            });
            return Sanitizer.scrub(`[SUCCESS] Thread ${threadTs} updated.`);
        }
        catch (e) {
            return `[ERROR] Slack API Error: ${e.message}`;
        }
    }
};
SlackService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SlackService);
export { SlackService };
//# sourceMappingURL=slack.service.js.map