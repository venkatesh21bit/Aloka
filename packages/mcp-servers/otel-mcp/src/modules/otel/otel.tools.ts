import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { OTelService } from './otel.service.js';

export class OTelTools {
  constructor(private readonly otelService: OTelService) {}

  @Tool({
    name: 'get_trace_spans',
    description: 'Filter spans by trace ID to extract root-cause error details from Grafana Tempo',
    inputSchema: z.object({
      trace_id: z.string(),
      filter_status: z.enum(['ALL', 'ERROR']).default('ERROR')
    })
  })
  async getTraceSpans(args: { trace_id: string, filter_status: 'ALL' | 'ERROR' }) {
    const spans = await this.otelService.fetchTraceSpans(args.trace_id, args.filter_status);
    return spans.length > 4000 ? spans.substring(0, 4000) : spans;
  }

  @Tool({
    name: 'get_service_dependency_graph',
    description: 'Maps upstream callers and downstream targets involved in a failed transaction',
    inputSchema: z.object({ trace_id: z.string() })
  })
  async getServiceDependencyGraph(args: { trace_id: string }) {
    return await this.otelService.fetchServiceDependencyGraph(args.trace_id);
  }
}
