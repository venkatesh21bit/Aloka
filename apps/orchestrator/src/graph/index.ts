import { StateGraph, START, END } from '@langchain/langgraph';
import { StateAnnotation } from './state';
import { diagnosticAgent } from '../agents/diagnostic';
import { traceAgent } from '../agents/trace';
import { patchAgent } from '../agents/patch';
import { verifierAgent } from '../agents/verifier';

export function createGraph() {
  const workflow = new StateGraph(StateAnnotation)
    .addNode('diagnostic', diagnosticAgent)
    .addNode('trace', traceAgent)
    .addNode('patch', patchAgent)
    .addNode('verifier', verifierAgent)
    .addEdge(START, 'diagnostic')
    .addEdge('diagnostic', 'trace')
    .addEdge('trace', 'patch')
    .addConditionalEdges('patch', (state) => {
      if (state.status === 'APPROVED') return 'verifier';
      return END;
    })
    .addEdge('verifier', END);

  return workflow.compile();
}
