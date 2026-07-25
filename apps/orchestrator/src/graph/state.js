import { Annotation } from '@langchain/langgraph';
// Using LangGraph's Annotation for state
export const StateAnnotation = Annotation.Root({
    status: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => 'PENDING'
    }),
    pipelineContext: Annotation({
        reducer: (curr, next) => ({ ...curr, ...next }),
        default: () => undefined
    }),
    jobLogs: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    traceId: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    traceSpans: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    domErrors: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    rcaSummary: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    patchDiff: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    slackThreadId: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    }),
    error: Annotation({
        reducer: (curr, next) => next || curr,
        default: () => ''
    })
});
