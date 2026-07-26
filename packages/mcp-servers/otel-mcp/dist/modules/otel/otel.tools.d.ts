import { OTelService } from './otel.service.js';
export declare class OTelTools {
    private readonly otelService;
    constructor(otelService: OTelService);
    getTraceSpans(args: {
        trace_id: string;
        filter_status: 'ALL' | 'ERROR';
    }): Promise<string>;
    getServiceDependencyGraph(args: {
        trace_id: string;
    }): Promise<string>;
    extractTraceId(args: {
        log_text: string;
    }): Promise<string>;
    getTraceContext(args: {
        trace_id: string;
        log_file_path?: string;
    }): Promise<string>;
}
//# sourceMappingURL=otel.tools.d.ts.map