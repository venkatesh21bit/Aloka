export declare class OTelService {
    private get baseUrl();
    private get authHeaders();
    fetchTraceSpans(traceId: string, filterStatus: string): Promise<string>;
    fetchServiceDependencyGraph(traceId: string): Promise<string>;
    fetchTraceWaterfall(traceId: string): Promise<string>;
    /**
     * Extract the first W3C traceparent trace-ID or B3/Zipkin X-B3-TraceId
     * found in an arbitrary text string (e.g. CI log output).
     *
     * Returns the 32-char lowercase hex trace ID, or null if none found.
     */
    extractTraceIdFromText(text: string): string | null;
    /**
     * Read a local OTel `.txt` log file and return a structured summary of all
     * spans matching the given `traceId`.
     *
     * Supports two line formats automatically:
     *   1. OTLP JSON lines  — `{ "traceId": "...", "spanId": "...", ... }`
     *   2. Key=value lines  — `traceId=... spanId=... service.name=... ...`
     */
    parseLocalOtelLog(logFilePath: string, traceId: string): string;
    /** Extract value for the first matching key in a `key=value` log line. */
    private _kvGet;
    /**
     * Parse Docker Compose multi-line OTel log format.
     * Each record is a JS object printed across ~40 lines, prefixed with "service  |".
     * We group consecutive lines into records delimited by the top-level `{` / `}` pair,
     * then extract fields with regex.
     */
    private _parseDockerComposeLog;
}
//# sourceMappingURL=otel.service.d.ts.map