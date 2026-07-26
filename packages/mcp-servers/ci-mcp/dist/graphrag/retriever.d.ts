/**
 * Subgraph retrieval — extract relevant CI failure context from the pipeline graph.
 *
 * TypeScript port of kassi/graphrag/retriever.py, adapted for CI pipelines.
 *
 * BFS from each failed-step node, collecting job → step → error facts.
 * Heuristic file suggestion mirrors kassi's _paths_match: extract module/package
 * names from error messages and match against changed file paths.
 */
import { CIPipelineGraph, PipelineContextData } from './builder.js';
export interface RunMeta {
    run_id: number;
    status: string;
    conclusion: string;
    commit_sha: string;
    author: string;
}
export interface FailedJob {
    id: string;
    name: string;
    conclusion: string;
}
export interface FailedStep {
    id: string;
    name: string;
    exit_code: number;
    log_tail: string;
}
export interface ErrorNode {
    pattern: string;
    message: string;
    category: string;
    step_name: string;
}
/** The full retrieved context — LLM-injectable via toText(). */
export interface CIRetrievedContext {
    runMeta: RunMeta;
    failedJobs: FailedJob[];
    failedSteps: FailedStep[];
    errors: ErrorNode[];
    changedFiles: string[];
    suggestedFiles: string[];
    toText(): string;
}
export declare class CISubgraphRetriever {
    private readonly graph;
    constructor(graph: CIPipelineGraph);
    /**
     * BFS from failed-step nodes, collecting all related context.
     * Mirrors SubgraphRetriever.for_endpoints() in kassi.
     */
    forRun(raw: PipelineContextData): CIRetrievedContext;
    /**
     * Heuristic: match error module/package names against changed file paths.
     * Port of kassi's _paths_match + _match_endpoints_in_text logic.
     *
     * Examples:
     *   "Cannot find module 'payment/service'"  → suggests src/payment/service.ts
     *   "ModuleNotFoundError: No module named 'utils'" → suggests utils.py / utils/index.ts
     */
    private suggestFiles;
}
//# sourceMappingURL=retriever.d.ts.map