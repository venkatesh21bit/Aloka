export declare class GitTools {
    constructor();
    readFileAtCommit(args: {
        repo: string;
        commit: string;
        path: string;
    }): Promise<string>;
    createBranchAndPr(args: {
        repo_slug: string;
        base_branch: string;
        new_branch: string;
        file_changes: {
            path: string;
            content: string;
        }[];
        pr_title: string;
        pr_body?: string;
    }): Promise<string>;
}
//# sourceMappingURL=git.tools.d.ts.map