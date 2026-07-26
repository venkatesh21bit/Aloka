import { BrowserService } from './browser.service.js';
export declare class BrowserTools {
    private readonly browserService;
    constructor(browserService: BrowserService);
    captureViewportScreenshot(args: {
        url: string;
    }): Promise<string>;
    inspectDomElement(args: {
        url: string;
        css_selector?: string;
        capture_console_errors: boolean;
    }): Promise<string>;
}
//# sourceMappingURL=browser.tools.d.ts.map