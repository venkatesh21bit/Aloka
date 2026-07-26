var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResourceDecorator as Resource, ControllerDecorator as Controller } from '@nitrostack/core';
import { CIService } from './ci.service.js';
const ciServiceInstance = new CIService();
let CIResources = class CIResources {
    ciService;
    constructor(ciService) {
        this.ciService = ciService;
        this.getRawLogs = this.getRawLogs.bind(this);
        this.getPipelineContext = this.getPipelineContext.bind(this);
    }
    async getRawLogs(uri, params) {
        return {
            contents: [{ uri, text: await ciServiceInstance.fetchRawLogs(params.owner, params.repo, params.run_id) }]
        };
    }
    async getPipelineContext(uri, params) {
        return {
            contents: [{
                    uri,
                    text: await ciServiceInstance.buildCiGraphragContext(params.owner, params.repo, params.run_id)
                }]
        };
    }
};
__decorate([
    Resource({
        name: 'raw_logs',
        uri: 'ci://{owner}/{repo}/pipeline/{run_id}/raw-logs',
        description: 'Read-only stream containing unredacted raw build logs'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CIResources.prototype, "getRawLogs", null);
__decorate([
    Resource({
        name: 'pipeline_context',
        uri: 'ci://{owner}/{repo}/pipeline/{run_id}/context',
        description: 'Graph-grounded CI failure context. Returns a structured, LLM-ready text summary of the pipeline ' +
            'failure: failed jobs, steps, classified errors, changed files, and graph-heuristic suggested fix targets. ' +
            'Built server-side by the CI GraphRAG engine — use this as primary context for root-cause analysis.'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CIResources.prototype, "getPipelineContext", null);
CIResources = __decorate([
    Controller(),
    __metadata("design:paramtypes", [CIService])
], CIResources);
export { CIResources };
//# sourceMappingURL=ci.resources.js.map