export declare class GitService {
    private octokit;
    constructor();
    private parseSlug;
    readFile(repoSlug: string, commit: string, path: string): Promise<string>;
    createBranchAndPr(repoSlug: string, base: string, branch: string, changes: {
        path: string;
        content: string;
    }[], title: string, body?: string): Promise<string>;
}
//# sourceMappingURL=git.service.d.ts.map