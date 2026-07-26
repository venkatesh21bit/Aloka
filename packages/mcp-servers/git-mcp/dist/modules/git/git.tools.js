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
import { GitService } from './git.service.js';
const gitService = new GitService();
export class GitTools {
    constructor() { }
    async readFileAtCommit(args) {
        return await gitService.readFile(args.repo, args.commit, args.path);
    }
    async createBranchAndPr(args) {
        return await gitService.createBranchAndPr(args.repo_slug, args.base_branch, args.new_branch, args.file_changes, args.pr_title, args.pr_body);
    }
}
__decorate([
    Tool({
        name: 'read_file_at_commit',
        description: 'Fetches exact file contents at a given commit SHA',
        inputSchema: z.object({ repo: z.string(), commit: z.string(), path: z.string() })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GitTools.prototype, "readFileAtCommit", null);
__decorate([
    Tool({
        name: 'create_branch_and_pr',
        description: 'Stage fix, create branch, and open Pull Request',
        inputSchema: z.object({
            repo_slug: z.string(),
            base_branch: z.string().default('main'),
            new_branch: z.string(),
            file_changes: z.array(z.object({ path: z.string(), content: z.string() })),
            pr_title: z.string(),
            pr_body: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GitTools.prototype, "createBranchAndPr", null);
//# sourceMappingURL=git.tools.js.map