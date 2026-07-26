export declare class CIService {
    private octokit;
    constructor();
    fetchFailedJobLogs(owner: string, repo: string, jobId: string, tailLines: number, filter?: string): Promise<string>;
    fetchPipelineContext(owner: string, repo: string, runId: string): Promise<string>;
    fetchRawLogs(owner: string, repo: string, runId: string): Promise<string>;
    /**
     * List all jobs for a workflow run including their steps.
     * Returns sanitized JSON array of job objects.
     */
    fetchWorkflowJobs(owner: string, repo: string, runId: string): Promise<string>;
    /**
     * Fetch log slices for failed steps in a specific job.
     * Returns an array of { job_id, step_name, exit_code, log_tail } objects.
     */
    fetchFailedStepDetails(owner: string, repo: string, jobId: string): Promise<string>;
    /**
     * Fetch the list of files changed in the head commit of a workflow run.
     */
    fetchChangedFiles(owner: string, repo: string, runId: string): Promise<string>;
    /**
     * Fetch a unified diff of the head commit against its parent.
     * Capped at MAX_DIFF_LINES lines.
     */
    fetchCommitDiff(owner: string, repo: string, sha: string): Promise<string>;
    /**
     * Build the full CI GraphRAG context server-side.
     *
     * Orchestrates all four GitHub fetches, feeds raw data into the bundled
     * CIPipelineGraph + CISubgraphRetriever, and returns CIRetrievedContext.toText()
     * — an LLM-ready, graph-grounded failure summary.
     *
     * This is the primary method called by get_ci_graphrag_context @Tool.
     */
    buildCiGraphragContext(owner: string, repo: string, runId: string): Promise<string>;
}
//# sourceMappingURL=ci.service.d.ts.map