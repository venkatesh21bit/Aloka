import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class OTelService {
  private get baseUrl() {
    const url = process.env.TEMPO_URL;
    if (!url) throw new Error("Missing TEMPO_URL environment variable");
    return url;
  }

  private get authHeaders(): Record<string, string> {
    const token = process.env.TEMPO_API_TOKEN;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  public async fetchTraceSpans(traceId: string, filterStatus: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/traces/${traceId}`, {
        headers: this.authHeaders
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Tempo returns OpenTelemetry OTLP JSON format or similar depending on the exact endpoint.
      // We will assume a simplified JSON extraction of spans:
      let spans = data?.batches?.flatMap((b: any) => 
        b.instrumentationLibrarySpans?.flatMap((ils: any) => ils.spans)
      ) || [];

      if (filterStatus === 'ERROR') {
        spans = spans.filter((s: any) => s.status?.code === 'STATUS_CODE_ERROR');
      }

      return Sanitizer.scrub(JSON.stringify(spans, null, 2));
    } catch (e: any) {
      return `[ERROR] Tempo API failed to fetch trace spans: ${e.message}`;
    }
  }

  public async fetchServiceDependencyGraph(traceId: string): Promise<string> {
    try {
      // Typically, Tempo doesn't natively return a "graph", but we can build a simple one from the trace spans
      const response = await fetch(`${this.baseUrl}/api/traces/${traceId}`, {
        headers: this.authHeaders
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const spans = data?.batches?.flatMap((b: any) => 
        b.instrumentationLibrarySpans?.flatMap((ils: any) => ils.spans)
      ) || [];

      // A mock graph builder
      const graph = { edges: spans.map((s: any) => ({ from: s.parentSpanId || 'root', to: s.spanId, name: s.name })) };
      return Sanitizer.scrub(JSON.stringify(graph, null, 2));
    } catch (e: any) {
      return `[ERROR] Tempo API failed to build dependency graph: ${e.message}`;
    }
  }

  public async fetchTraceWaterfall(traceId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/traces/${traceId}`, {
        headers: this.authHeaders
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return Sanitizer.scrub(JSON.stringify(data, null, 2));
    } catch (e: any) {
      return `[ERROR] Tempo API failed to fetch waterfall: ${e.message}`;
    }
  }
}
