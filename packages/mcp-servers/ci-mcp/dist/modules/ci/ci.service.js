var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';
import { Octokit } from '@octokit/rest';
import { CIPipelineGraph } from '../../graphrag/builder.js';
import { CISubgraphRetriever } from '../../graphrag/retriever.js';
const MAX_PAYLOAD = 4000;
const MAX_DIFF_LINES = 150;
function trim(text, limit = MAX_PAYLOAD) {
    return text.length > limit ? text.slice(0, limit) + '\n...[truncated]' : text;
}
let CIService = class CIService {
    octokit;
    constructor() {
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }
    // ─── Existing methods ─────────────────────────────────────────────────────
    async fetchFailedJobLogs(owner, repo, jobId, tailLines, filter) {
        try {
            const response = await this.octokit.actions.downloadJobLogsForWorkflowRun({
                owner,
                repo,
                job_id: parseInt(jobId, 10),
            });
            let rawLogs = response.data;
            if (filter) {
                rawLogs = rawLogs.split('\n').filter(l => l.includes(filter)).join('\n');
            }
            const lines = rawLogs.split('\n');
            const logs = lines.slice(Math.max(lines.length - tailLines, 0)).join('\n');
            return Sanitizer.scrub(trim(logs));
        }
        catch (error) {
            return `[ERROR] Failed to fetch logs for job ${jobId}: ${error.message}`;
        }
    }
    async fetchPipelineContext(owner, repo, runId) {
        try {
            const response = await this.octokit.actions.getWorkflowRun({
                owner,
                repo,
                run_id: parseInt(runId, 10),
            });
            return Sanitizer.scrub(JSON.stringify({
                run_id: response.data.id,
                commit_sha: response.data.head_sha,
                author: response.data.head_commit?.author?.email ?? 'unknown',
                status: response.data.status,
                conclusion: response.data.conclusion,
            }));
        }
        catch (error) {
            return `[ERROR] Failed to fetch pipeline context for run ${runId}: ${error.message}`;
        }
    }
    async fetchRawLogs(owner, repo, runId) {
        try {
            await this.octokit.actions.downloadWorkflowRunLogs({
                owner,
                repo,
                run_id: parseInt(runId, 10),
            });
            return Sanitizer.scrub(`[NOTE] Raw logs downloaded for pipeline ${runId}. (Zip archive returned by GitHub API)`);
        }
        catch (error) {
            return `[ERROR] Failed to fetch raw logs for run ${runId}: ${error.message}`;
        }
    }
    // ─── New methods ──────────────────────────────────────────────────────────
    /**
     * List all jobs for a workflow run including their steps.
     * Returns sanitized JSON array of job objects.
     */
    async fetchWorkflowJobs(owner, repo, runId) {
        try {
            const response = await this.octokit.actions.listJobsForWorkflowRun({
                owner,
                repo,
                run_id: parseInt(runId, 10),
                per_page: 30,
            });
            const jobs = response.data.jobs.map(job => ({
                id: job.id,
                name: job.name,
                status: job.status,
                conclusion: job.conclusion,
                steps: (job.steps ?? []).map(s => ({
                    name: s.name,
                    number: s.number,
                    status: s.status,
                    conclusion: s.conclusion,
                })),
            }));
            return Sanitizer.scrub(trim(JSON.stringify(jobs)));
        }
        catch (error) {
            return `[ERROR] Failed to fetch workflow jobs for run ${runId}: ${error.message}`;
        }
    }
    /**
     * Fetch log slices for failed steps in a specific job.
     * Returns an array of { job_id, step_name, exit_code, log_tail } objects.
     */
    async fetchFailedStepDetails(owner, repo, jobId) {
        try {
            const [jobResponse, logsResponse] = await Promise.all([
                this.octokit.actions.getJobForWorkflowRun({ owner, repo, job_id: parseInt(jobId, 10) }),
                this.octokit.actions.downloadJobLogsForWorkflowRun({ owner, repo, job_id: parseInt(jobId, 10) }),
            ]);
            const rawLog = logsResponse.data;
            const allLines = rawLog.split('\n');
            const steps = jobResponse.data.steps ?? [];
            const failedSteps = steps.filter(s => s.conclusion === 'failure');
            const slices = failedSteps.map(step => {
                // Extract log lines for this step by looking for the step header pattern in GH Actions logs
                const stepHeader = new RegExp(`##\\[group\\]Run ${step.name}|##\\[group\\]${step.name}`, 'i');
                const startIdx = allLines.findIndex(l => stepHeader.test(l));
                const endIdx = startIdx === -1
                    ? allLines.length
                    : allLines.findIndex((l, i) => i > startIdx && l.startsWith('##[endgroup]'));
                const stepLines = startIdx === -1
                    ? allLines.slice(-50) // fallback: last 50 lines
                    : allLines.slice(startIdx, endIdx === -1 ? allLines.length : endIdx);
                const logTail = stepLines.slice(-80).join('\n'); // keep last 80 lines per step
                return {
                    job_id: parseInt(jobId, 10),
                    step_name: step.name,
                    exit_code: step.conclusion === 'failure' ? 1 : 0,
                    log_tail: logTail,
                };
            });
            return Sanitizer.scrub(trim(JSON.stringify(slices)));
        }
        catch (error) {
            return `[ERROR] Failed to fetch step details for job ${jobId}: ${error.message}`;
        }
    }
    /**
     * Fetch the list of files changed in the head commit of a workflow run.
     */
    async fetchChangedFiles(owner, repo, runId) {
        try {
            const runResponse = await this.octokit.actions.getWorkflowRun({
                owner,
                repo,
                run_id: parseInt(runId, 10),
            });
            const sha = runResponse.data.head_sha;
            const compareResponse = await this.octokit.repos.getCommit({ owner, repo, ref: sha });
            const files = (compareResponse.data.files ?? [])
                .map(f => f.filename)
                .filter(Boolean)
                .slice(0, 50); // cap at 50 files
            return Sanitizer.scrub(trim(JSON.stringify(files)));
        }
        catch (error) {
            return `[ERROR] Failed to fetch changed files for run ${runId}: ${error.message}`;
        }
    }
    /**
     * Fetch a unified diff of the head commit against its parent.
     * Capped at MAX_DIFF_LINES lines.
     */
    async fetchCommitDiff(owner, repo, sha) {
        try {
            const response = await this.octokit.repos.getCommit({
                owner,
                repo,
                ref: sha,
                headers: { Accept: 'application/vnd.github.v3.diff' },
            });
            const diff = response.data ?? '';
            const lines = diff.split('\n').slice(0, MAX_DIFF_LINES).join('\n');
            return Sanitizer.scrub(trim(lines));
        }
        catch (error) {
            return `[ERROR] Failed to fetch commit diff for ${sha}: ${error.message}`;
        }
    }
    /**
     * Build the full CI GraphRAG context server-side.
     *
     * Orchestrates all four GitHub fetches, feeds raw data into the bundled
     * CIPipelineGraph + CISubgraphRetriever, and returns CIRetrievedContext.toText()
     * — an LLM-ready, graph-grounded failure summary.
     *
     * This is the primary method called by get_ci_graphrag_context @Tool.
     */
    async buildCiGraphragContext(owner, repo, runId) {
        try {
            // 1. Fetch raw metadata
            const runResponse = await this.octokit.actions.getWorkflowRun({
                owner, repo, run_id: parseInt(runId, 10),
            });
            const runData = runResponse.data;
            const runMeta = {
                run_id: runData.id,
                commit_sha: runData.head_sha,
                author: runData.head_commit?.author?.email ?? 'unknown',
                status: runData.status ?? 'unknown',
                conclusion: runData.conclusion,
            };
            // 2. Fetch jobs
            const jobsResponse = await this.octokit.actions.listJobsForWorkflowRun({
                owner, repo, run_id: parseInt(runId, 10), per_page: 30,
            });
            const jobs = jobsResponse.data.jobs.map(job => ({
                id: job.id,
                name: job.name,
                conclusion: job.conclusion ?? null,
                steps: (job.steps ?? []).map(s => ({
                    name: s.name,
                    number: s.number,
                    conclusion: s.conclusion ?? null,
                })),
            }));
            // 3. Fetch step log slices for each failed job (in parallel, capped at 5 jobs)
            const failedJobs = jobs.filter(j => j.conclusion === 'failure').slice(0, 5);
            const stepDetailArrays = await Promise.all(failedJobs.map(async (job) => {
                try {
                    const [jobResponse, logsResponse] = await Promise.all([
                        this.octokit.actions.getJobForWorkflowRun({ owner, repo, job_id: job.id }),
                        this.octokit.actions.downloadJobLogsForWorkflowRun({ owner, repo, job_id: job.id }),
                    ]);
                    const rawLog = logsResponse.data;
                    const lines = rawLog.split('\n');
                    return (jobResponse.data.steps ?? [])
                        .filter(s => s.conclusion === 'failure')
                        .slice(0, 3) // max 3 failed steps per job
                        .map((s) => ({
                        job_id: job.id,
                        step_name: s.name,
                        exit_code: 1,
                        log_tail: lines.slice(-400).join('\n'),
                    }));
                }
                catch {
                    return [];
                }
            }));
            const stepDetails = stepDetailArrays.flat();
            // 4. Fetch changed files
            let changedFiles = [];
            try {
                const commitResponse = await this.octokit.repos.getCommit({ owner, repo, ref: runMeta.commit_sha });
                changedFiles = (commitResponse.data.files ?? []).map(f => f.filename).filter(Boolean).slice(0, 30);
            }
            catch { /* non-fatal */ }
            // 5. Build graph + retrieve context (bundled GraphRAG, in-process)
            const contextData = { runMeta, jobs, stepDetails, changedFiles };
            const graph = CIPipelineGraph.fromContext(contextData);
            const ctx = new CISubgraphRetriever(graph).forRun(contextData);
            // 6. Return sanitized, LLM-ready context text
            return Sanitizer.scrub(trim(ctx.toText(), 3800));
        }
        catch (error) {
            return `[ERROR] Failed to build CI graphrag context for run ${runId}: ${error.message}`;
        }
    }
};
CIService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], CIService);
export { CIService };
//# sourceMappingURL=ci.service.js.map