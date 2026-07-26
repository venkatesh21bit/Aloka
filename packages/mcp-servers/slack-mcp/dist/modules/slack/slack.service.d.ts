export declare class SlackService {
    private client;
    constructor();
    postAlert(channelId: string, summary: string, diff: string, traceUrl?: string, actions?: string[]): Promise<string>;
    updateMessage(channelId: string, threadTs: string, update: string): Promise<string>;
}
//# sourceMappingURL=slack.service.d.ts.map