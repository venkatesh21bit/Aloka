var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z } from '@nitrostack/core';
import { IssueService } from './issue.service.js';
const issueService = new IssueService();
export class IssueTools {
    constructor() { }
    async createOrUpdateIssue(args) {
        return await issueService.createOrUpdate(args.project_key, args.title, args.description, args.priority, args.trace_id);
    }
}
__decorate([
    Tool({
        name: 'create_or_update_issue',
        description: 'Create or update issue ticket in Jira',
        inputSchema: z.object({
            project_key: z.string(),
            title: z.string(),
            description: z.string(),
            priority: z.enum(['P0', 'P1', 'P2']).optional(),
            trace_id: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IssueTools.prototype, "createOrUpdateIssue", null);
//# sourceMappingURL=issue.tools.js.map