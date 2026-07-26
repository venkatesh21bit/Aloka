import { OTelService } from './otel.service.js';
export declare class OTelResources {
    private readonly otelService;
    constructor(otelService: OTelService);
    getTraceWaterfall(uri: string, params: {
        trace_id: string;
    }): Promise<{
        contents: {
            uri: string;
            text: string;
        }[];
    }>;
}
//# sourceMappingURL=otel.resources.d.ts.map