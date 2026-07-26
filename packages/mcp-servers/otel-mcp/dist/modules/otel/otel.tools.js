var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z } from '@nitrostack/core';
export class OTelTools {
    otelService;
    constructor(otelService) {
        this.otelService = otelService;
    }
    // ─── Existing tools (Tempo backend) ────────────────────────────────────────
    async getTraceSpans(args) {
        const spans = await this.otelService.fetchTraceSpans(args.trace_id, args.filter_status);
        return spans.length > 4000 ? spans.substring(0, 4000) : spans;
    }
    async getServiceDependencyGraph(args) {
        return await this.otelService.fetchServiceDependencyGraph(args.trace_id);
    }
    // ─── New tools (local OTel log file) ───────────────────────────────────────
    async extractTraceId(args) {
        const traceId = this.otelService.extractTraceIdFromText(args.log_text);
        return traceId ?? '';
    }
    async getTraceContext(args) {
        const filePath = args.log_file_path ?? process.env.OTEL_LOG_FILE ?? '';
        if (!filePath) {
            return '[ERROR] No log file path provided. Set OTEL_LOG_FILE or pass log_file_path.';
        }
        return this.otelService.parseLocalOtelLog(filePath, args.trace_id);
    }
}
__decorate([
    Tool({
        name: 'get_trace_spans',
        description: 'Filter spans by trace ID to extract root-cause error details from Grafana Tempo',
        inputSchema: z.object({
            trace_id: z.string(),
            filter_status: z.enum(['ALL', 'ERROR']).default('ERROR')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTelTools.prototype, "getTraceSpans", null);
__decorate([
    Tool({
        name: 'get_service_dependency_graph',
        description: 'Maps upstream callers and downstream targets involved in a failed transaction',
        inputSchema: z.object({ trace_id: z.string() })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTelTools.prototype, "getServiceDependencyGraph", null);
__decorate([
    Tool({
        name: 'extract_trace_id',
        description: 'Extract the first W3C traceparent (00-<traceId>-<spanId>-<flags>) or B3/Zipkin ' +
            'X-B3-TraceId from an arbitrary log string. Returns the 32-char hex trace ID or an empty ' +
            'string if none found. Use this on CI log output before calling get_trace_context.',
        inputSchema: z.object({
            log_text: z.string().describe('Raw CI log text or any string that may contain a traceparent header')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTelTools.prototype, "extractTraceId", null);
__decorate([
    Tool({
        name: 'get_trace_context',
        description: 'Read a local OpenTelemetry `.txt` log file and return a structured LLM-ready summary of ' +
            'all spans matching the given trace ID. Surfaces error spans, service call chain, and ' +
            'root-cause candidates. Supports OTLP JSON-line and key=value log formats. ' +
            'Set OTEL_LOG_FILE env var or pass log_file_path explicitly.',
        inputSchema: z.object({
            trace_id: z.string().describe('32-char hex trace ID to filter spans by'),
            log_file_path: z.string().optional().describe('Absolute path to the local OTel .txt log file. Defaults to OTEL_LOG_FILE env var.')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OTelTools.prototype, "getTraceContext", null);
//# sourceMappingURL=otel.tools.js.map