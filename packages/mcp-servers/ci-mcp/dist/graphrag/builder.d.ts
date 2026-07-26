/**
 * Build a directed graph from CI pipeline context data.
 *
 * TypeScript port of kassi/graphrag/builder.py, adapted for CI pipelines
 * instead of OpenAPI specs.
 *
 * Nodes: run, job, step, error, file.
 * Edges: HAS_JOB, HAS_STEP, EMITS_ERROR, TOUCHES_FILE.
 *
 * Error nodes are built by deterministic regex pattern-matching on step log
 * tails — same philosophy as kassi's _resolve_ref (no LLM involved).
 */
import { DiGraph } from './digraph.js';
export interface GitHubStep {
    name: string;
    conclusion: string | null;
    number: number;
}
export interface GitHubJob {
    id: number;
    name: string;
    conclusion: string | null;
    steps: GitHubStep[];
}
export interface StepLogSlice {
    job_id: number;
    step_name: string;
    exit_code: number;
    log_tail: string;
}
export interface GitHubRunMeta {
    run_id: number;
    commit_sha: string;
    author: string;
    status: string;
    conclusion: string | null;
}
export interface PipelineContextData {
    runMeta: GitHubRunMeta;
    jobs: GitHubJob[];
    stepDetails: StepLogSlice[];
    changedFiles: string[];
}
export interface SerializedGraph {
    nodes: Array<{
        id: string;
    } & Record<string, unknown>>;
    edges: Array<{
        source: string;
        target: string;
    } & Record<string, unknown>>;
}
/**
 * Deterministic knowledge graph built from a CI pipeline context.
 *
 * Mirrors kassi's OpenAPIGraph but for CI data:
 *   - run nodes   ↔  endpoint nodes
 *   - job nodes   ↔  schema nodes
 *   - step nodes  ↔  property nodes
 *   - error nodes ↔  security/param nodes
 *   - file nodes  ↔  referenced schemas
 */
export declare class CIPipelineGraph {
    readonly graph: DiGraph;
    constructor(graph: DiGraph);
    static fromContext(data: PipelineContextData): CIPipelineGraph;
    toDict(): SerializedGraph;
    static fromDict(data: SerializedGraph): CIPipelineGraph;
    failedStepIds(): string[];
    changedFileIds(): string[];
    errorIds(): string[];
    stats(): {
        jobs: number;
        steps: number;
        errors: number;
        files: number;
        nodes: number;
        edges: number;
    };
}
//# sourceMappingURL=builder.d.ts.map