import { StateAnnotation } from '../graph/state';

export async function diagnosticAgent(state: typeof StateAnnotation.State) {
  console.log(`[Diagnostic Agent] Processing job logs for ${state.pipelineContext?.failing_job_id}`);
  
  // Mock MCP tool calls
  const logs = `[Mock ci-mcp] Fetched logs. Extracted Trace ID: trace-999`;
  const spans = `[Mock otel-mcp] Spans for trace-999: NullPointerException in payment-service`;

  return {
    status: 'PATCHING' as const,
    jobLogs: logs,
    traceId: 'trace-999',
    traceSpans: spans
  };
}
