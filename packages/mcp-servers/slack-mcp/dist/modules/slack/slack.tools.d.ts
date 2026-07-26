export declare class SlackTools {
    constructor();
    postInteractiveAlert(args: {
        channel_id: string;
        rca_summary: string;
        diff_patch: string;
        trace_url?: string;
        action_buttons?: string[];
    }): Promise<string>;
    updateThreadMessage(args: {
        channel_id: string;
        thread_ts: string;
        update_text: string;
    }): Promise<string>;
}
//# sourceMappingURL=slack.tools.d.ts.map