var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { K8sTestTools } from './k8s-test.tools.js';
import { K8sTestService } from './k8s-test.service.js';
let K8sTestModule = class K8sTestModule {
};
K8sTestModule = __decorate([
    Module({
        name: 'k8s-test',
        description: 'Kubernetes ephemeral testing MCP server',
        controllers: [K8sTestTools],
        providers: [K8sTestService]
    })
], K8sTestModule);
export { K8sTestModule };
//# sourceMappingURL=k8s-test.module.js.map