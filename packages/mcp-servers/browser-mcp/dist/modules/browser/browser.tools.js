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
export class BrowserTools {
    browserService;
    constructor(browserService) {
        this.browserService = browserService;
    }
    async captureViewportScreenshot(args) {
        return await this.browserService.captureScreenshot(args.url);
    }
    async inspectDomElement(args) {
        const result = await this.browserService.inspectDom(args.url, args.css_selector, args.capture_console_errors);
        return result.length > 4000 ? result.substring(0, 4000) : result;
    }
}
__decorate([
    Tool({
        name: 'capture_viewport_screenshot',
        description: 'Replays user steps on a target route, takes a screenshot',
        inputSchema: z.object({ url: z.string().url() })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserTools.prototype, "captureViewportScreenshot", null);
__decorate([
    Tool({
        name: 'inspect_dom_element',
        description: 'Inspect DOM node attributes and console errors at failure URL',
        inputSchema: z.object({
            url: z.string().url(),
            css_selector: z.string().optional(),
            capture_console_errors: z.boolean().default(true)
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserTools.prototype, "inspectDomElement", null);
//# sourceMappingURL=browser.tools.js.map