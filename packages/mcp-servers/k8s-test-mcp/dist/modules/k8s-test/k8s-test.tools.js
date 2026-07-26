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
import { K8sTestService } from './k8s-test.service.js';
const k8sTestService = new K8sTestService();
export class K8sTestTools {
    constructor() { }
    async runEphemeralTestSuite(args) {
        return await k8sTestService.runSuite(args.suite_name, args.patch_diff, args.target_namespace);
    }
    async getTestExecutionStatus(args) {
        return await k8sTestService.getStatus(args.run_id);
    }
}
__decorate([
    Tool({
        name: 'run_ephemeral_test_suite',
        description: 'Execute targeted integration tests in an ephemeral K8s pod',
        inputSchema: z.object({
            suite_name: z.string(),
            patch_diff: z.string(),
            target_namespace: z.string().default('omnitrace-sandbox')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], K8sTestTools.prototype, "runEphemeralTestSuite", null);
__decorate([
    Tool({
        name: 'get_test_execution_status',
        description: 'Polls running Testkube execution status',
        inputSchema: z.object({ run_id: z.string() })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], K8sTestTools.prototype, "getTestExecutionStatus", null);
//# sourceMappingURL=k8s-test.tools.js.map