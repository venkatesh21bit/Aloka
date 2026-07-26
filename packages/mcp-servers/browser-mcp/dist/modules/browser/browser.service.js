var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';
import { chromium } from 'playwright';
let BrowserService = class BrowserService {
    async captureScreenshot(url) {
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle' });
            const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 50 });
            await browser.close();
            return `data:image/jpeg;base64,${screenshotBuffer.toString('base64')}`;
        }
        catch (e) {
            return `[ERROR] Playwright screenshot failed: ${e.message}`;
        }
    }
    async inspectDom(url, cssSelector, captureConsole) {
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            const consoleLogs = [];
            if (captureConsole) {
                page.on('console', msg => {
                    if (msg.type() === 'error') {
                        consoleLogs.push(`[CONSOLE ERROR] ${msg.text()}`);
                    }
                });
            }
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            let domHtml = '';
            if (cssSelector) {
                domHtml = await page.locator(cssSelector).innerHTML().catch(() => 'Selector not found');
            }
            else {
                domHtml = await page.evaluate(() => document.body.innerHTML);
            }
            await browser.close();
            const report = `URL: ${url}\nSelector: ${cssSelector || 'body'}\n\nDOM:\n${domHtml}\n\nConsole Errors:\n${consoleLogs.join('\n')}`;
            return Sanitizer.scrub(report);
        }
        catch (e) {
            return `[ERROR] Playwright DOM inspection failed: ${e.message}`;
        }
    }
};
BrowserService = __decorate([
    Injectable()
], BrowserService);
export { BrowserService };
//# sourceMappingURL=browser.service.js.map