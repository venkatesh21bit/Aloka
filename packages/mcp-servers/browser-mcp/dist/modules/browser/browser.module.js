var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { BrowserTools } from './browser.tools.js';
import { BrowserService } from './browser.service.js';
let BrowserModule = class BrowserModule {
};
BrowserModule = __decorate([
    Module({
        name: 'browser',
        description: 'Browser automation and DOM inspection',
        controllers: [BrowserTools],
        providers: [BrowserService]
    })
], BrowserModule);
export { BrowserModule };
//# sourceMappingURL=browser.module.js.map