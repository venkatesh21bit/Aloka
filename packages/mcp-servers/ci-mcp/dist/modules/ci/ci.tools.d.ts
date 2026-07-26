import { CIService } from './ci.service.js';
export declare class CITools {
    private readonly ciService;
    constructor(ciService: CIService);
    getFailedJobLogs(args: {
        owner: string;
        repo: string;
        job_id: string;
        tail_lines: number;
        step_filter?: string;
    }): Promise<string>;
    getPipelineContext(args: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<string>;
    getWorkflowJobs(args: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<string>;
    getFailedStepDetails(args: {
        owner: string;
        repo: string;
        job_id: string;
    }): Promise<string>;
    getChangedFiles(args: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<string>;
    getCommitDiff(args: {
        owner: string;
        repo: string;
        sha: string;
    }): Promise<string>;
    getCiGraphragContext(args: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<string>;
}
//# sourceMappingURL=ci.tools.d.ts.map