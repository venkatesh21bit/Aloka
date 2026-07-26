var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z, ControllerDecorator as Controller } from '@nitrostack/core';
import { CIService } from './ci.service.js';
const ciServiceInstance = new CIService();
let CITools = class CITools {
    ciService;
    constructor(ciService) {
        this.ciService = ciService;
        this.getFailedJobLogs = this.getFailedJobLogs.bind(this);
        this.getPipelineContext = this.getPipelineContext.bind(this);
        this.getWorkflowJobs = this.getWorkflowJobs.bind(this);
        this.getFailedStepDetails = this.getFailedStepDetails.bind(this);
        this.getChangedFiles = this.getChangedFiles.bind(this);
        this.getCommitDiff = this.getCommitDiff.bind(this);
        this.getCiGraphragContext = this.getCiGraphragContext.bind(this);
    }
    // ─── Existing tools ────────────────────────────────────────────────────────
    async getFailedJobLogs(args) {
        const logs = await ciServiceInstance.fetchFailedJobLogs(args.owner, args.repo, args.job_id, args.tail_lines, args.step_filter);
        return logs.length > 4000 ? logs.substring(0, 4000) : logs;
    }
    async getPipelineContext(args) {
        return await ciServiceInstance.fetchPipelineContext(args.owner, args.repo, args.run_id);
    }
    // ─── New tools ─────────────────────────────────────────────────────────────
    async getWorkflowJobs(args) {
        return await ciServiceInstance.fetchWorkflowJobs(args.owner, args.repo, args.run_id);
    }
    async getFailedStepDetails(args) {
        return await ciServiceInstance.fetchFailedStepDetails(args.owner, args.repo, args.job_id);
    }
    async getChangedFiles(args) {
        return await ciServiceInstance.fetchChangedFiles(args.owner, args.repo, args.run_id);
    }
    async getCommitDiff(args) {
        return await ciServiceInstance.fetchCommitDiff(args.owner, args.repo, args.sha);
    }
    async getCiGraphragContext(args) {
        return await ciServiceInstance.buildCiGraphragContext(args.owner, args.repo, args.run_id);
    }
};
__decorate([
    Tool({
        name: 'get_failed_job_logs',
        description: 'Fetch log output for a failed CI job run',
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            job_id: z.coerce.string(),
            tail_lines: z.number().default(200),
            step_filter: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getFailedJobLogs", null);
__decorate([
    Tool({
        name: 'get_pipeline_context',
        description: 'Returns metadata associated with the build failure',
        inputSchema: z.object({ owner: z.string(), repo: z.string(), run_id: z.coerce.string() })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getPipelineContext", null);
__decorate([
    Tool({
        name: 'get_workflow_jobs',
        description: 'List all jobs (with their steps) for a workflow run. Returns job names, conclusions, and step-level status.',
        inputSchema: z.object({
            owner: z.string().describe('GitHub repository owner or organisation'),
            repo: z.string().describe('GitHub repository name'),
            run_id: z.coerce.string().describe('GitHub Actions workflow run ID')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getWorkflowJobs", null);
__decorate([
    Tool({
        name: 'get_failed_step_details',
        description: 'Fetch log slices for every failed step inside a specific CI job. Returns step name, exit code, and log tail.',
        inputSchema: z.object({
            owner: z.string().describe('GitHub repository owner or organisation'),
            repo: z.string().describe('GitHub repository name'),
            job_id: z.coerce.string().describe('GitHub Actions job ID (not run ID)')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getFailedStepDetails", null);
__decorate([
    Tool({
        name: 'get_changed_files',
        description: 'List files changed in the head commit of a workflow run. Used to identify which files are candidates for a fix.',
        inputSchema: z.object({
            owner: z.string().describe('GitHub repository owner or organisation'),
            repo: z.string().describe('GitHub repository name'),
            run_id: z.coerce.string().describe('GitHub Actions workflow run ID')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getChangedFiles", null);
__decorate([
    Tool({
        name: 'get_commit_diff',
        description: 'Fetch a unified diff of the head commit against its parent. Useful for understanding what code change triggered the failure.',
        inputSchema: z.object({
            owner: z.string().describe('GitHub repository owner or organisation'),
            repo: z.string().describe('GitHub repository name'),
            sha: z.string().describe('Commit SHA to diff against its parent')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getCommitDiff", null);
__decorate([
    Tool({
        name: 'get_ci_graphrag_context',
        description: 'Primary diagnostic tool. Fetches full CI pipeline data from GitHub, builds a knowledge graph ' +
            '(run → jobs → steps → errors, with changed files), traverses it with BFS to extract a structured ' +
            'failure summary, and returns a compact LLM-ready context string. ' +
            'Use this before attempting any fix — it provides the root-cause analysis, failed step details, ' +
            'error classification, and the list of files most likely to fix.',
        inputSchema: z.object({
            owner: z.string().describe('GitHub repository owner or organisation'),
            repo: z.string().describe('GitHub repository name'),
            run_id: z.coerce.string().describe('GitHub Actions workflow run ID of the failing build')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CITools.prototype, "getCiGraphragContext", null);
CITools = __decorate([
    Controller(),
    __metadata("design:paramtypes", [CIService])
], CITools);
export { CITools };
//# sourceMappingURL=ci.tools.js.map