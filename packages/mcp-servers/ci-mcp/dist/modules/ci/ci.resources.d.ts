import { CIService } from './ci.service.js';
export declare class CIResources {
    private readonly ciService;
    constructor(ciService: CIService);
    getRawLogs(uri: string, params: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<{
        contents: {
            uri: string;
            text: string;
        }[];
    }>;
    getPipelineContext(uri: string, params: {
        owner: string;
        repo: string;
        run_id: string;
    }): Promise<{
        contents: {
            uri: string;
            text: string;
        }[];
    }>;
}
//# sourceMappingURL=ci.resources.d.ts.map