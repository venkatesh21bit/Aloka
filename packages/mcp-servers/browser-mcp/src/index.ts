import { Module, Tool, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class BrowserService {
  public async captureScreenshot(url: string): Promise<string> {
    return Sanitizer.scrub(`[Mock Screenshot of ${url}]`);
  }

  public async inspectDom(url: string, cssSelector?: string, captureConsole?: boolean): Promise<string> {
    return Sanitizer.scrub(`Mock DOM state for ${cssSelector || 'body'} at ${url}. Console: Uncaught ReferenceError`);
  }
}

@Module({ providers: [BrowserService] })
export class BrowserServer {
  constructor(private readonly browserService: BrowserService) {}

  @Tool({
    name: 'capture_viewport_screenshot',
    description: 'Replays user steps on a target route, takes a screenshot',
    schema: z.object({ url: z.string().url() })
  })
  async captureViewportScreenshot(args: { url: string }) {
    return await this.browserService.captureScreenshot(args.url);
  }

  @Tool({
    name: 'inspect_dom_element',
    description: 'Inspect DOM node attributes and console errors at failure URL',
    schema: z.object({
      url: z.string().url(),
      css_selector: z.string().optional(),
      capture_console_errors: z.boolean().default(true)
    })
  })
  async inspectDomElement(args: { url: string, css_selector?: string, capture_console_errors: boolean }) {
    const result = await this.browserService.inspectDom(args.url, args.css_selector, args.capture_console_errors);
    return result.length > 4000 ? result.substring(0, 4000) : result;
  }
}

NitroStack.start(BrowserServer);
