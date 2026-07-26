export declare class IssueTools {
    constructor();
    createOrUpdateIssue(args: {
        project_key: string;
        title: string;
        description: string;
        priority?: 'P0' | 'P1' | 'P2';
        trace_id?: string;
    }): Promise<string>;
}
//# sourceMappingURL=issue.tools.d.ts.map