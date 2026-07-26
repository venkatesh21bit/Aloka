var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { McpApp, Module } from '@nitrostack/core';
import { K8sTestModule } from './modules/k8s-test/k8s-test.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'k8s-test-mcp',
            version: '1.0.0'
        },
        logging: {
            level: 'error'
        }
    }),
    Module({
        name: 'app',
        description: 'Root application module',
        imports: [
            K8sTestModule
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map