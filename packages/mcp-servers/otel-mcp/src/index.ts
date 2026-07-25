import { Module, Tool, Resource, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class OTelService {
  public async fetchTraceSpans(traceId: string, filterStatus: string): Promise<string> {
    const mockSpans = [
      { span_id: 'span-1', name: 'HTTP GET /checkout', status: 'OK' },
      { span_id: 'span-2', name: 'RPC payment-service', status: 'ERROR', error: 'NullPointerException' }
    ];
    const filtered = filterStatus === 'ERROR' ? mockSpans.filter(s => s.status === 'ERROR') : mockSpans;
    return Sanitizer.scrub(JSON.stringify(filtered, null, 2));
  }

  public async fetchServiceDependencyGraph(traceId: string): Promise<string> {
    const graph = { edges: [{ from: 'api-gateway', to: 'checkout-service' }, { from: 'checkout-service', to: 'payment-service', status: 'FAILED' }] };
    return Sanitizer.scrub(JSON.stringify(graph, null, 2));
  }

  public async fetchTraceWaterfall(traceId: string): Promise<string> {
    return Sanitizer.scrub(`Waterfall for ${traceId}: api-gateway -> checkout-service -> payment-service (500)`);
  }
}

@Module({ providers: [OTelService] })
export class OTelServer {
  constructor(private readonly otelService: OTelService) {}

  @Tool({
    name: 'get_trace_spans',
    description: 'Filter spans by trace ID to extract root-cause error details',
    schema: z.object({
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
    schema: z.object({ trace_id: z.string() })
  })
  async getServiceDependencyGraph(args: { trace_id: string }) {
    return await this.otelService.fetchServiceDependencyGraph(args.trace_id);
  }

  @Resource({
    uri: 'otel://traces/{trace_id}/waterfall',
    description: 'Structural JSON representation of the entire microservice call hierarchy'
  })
  async getTraceWaterfall(uri: string, params: { trace_id: string }) {
    return { contents: [{ uri, text: await this.otelService.fetchTraceWaterfall(params.trace_id) }] };
  }
}

NitroStack.start(OTelServer);
