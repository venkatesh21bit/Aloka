var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { GitTools } from './git.tools.js';
import { GitService } from './git.service.js';
let GitModule = class GitModule {
};
GitModule = __decorate([
    Module({
        name: 'git',
        description: 'Git operations MCP server',
        controllers: [GitTools],
        providers: [GitService]
    })
], GitModule);
export { GitModule };
//# sourceMappingURL=git.module.js.map