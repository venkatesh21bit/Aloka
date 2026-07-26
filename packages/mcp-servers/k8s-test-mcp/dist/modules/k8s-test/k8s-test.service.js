var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';
let K8sTestService = class K8sTestService {
    get baseUrl() {
        const url = process.env.TESTKUBE_URL;
        if (!url)
            throw new Error("Missing TESTKUBE_URL environment variable");
        return url;
    }
    get authHeaders() {
        const token = process.env.TESTKUBE_API_TOKEN;
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    async runSuite(suite, diff, ns) {
        try {
            // Trigger a Testkube Test Suite Execution
            const response = await fetch(`${this.baseUrl}/v1/testsuites/${suite}/executions`, {
                method: 'POST',
                headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    namespace: ns,
                    variables: {
                        PATCH_DIFF: {
                            name: "PATCH_DIFF",
                            value: diff,
                            type: "basic"
                        }
                    }
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Sanitizer.scrub(`[SUCCESS] Started test suite execution. Run ID: ${data.id}`);
        }
        catch (e) {
            return `[ERROR] Testkube API failed to run suite: ${e.message}`;
        }
    }
    async getStatus(runId) {
        try {
            const response = await fetch(`${this.baseUrl}/v1/testsuite-executions/${runId}`, {
                headers: this.authHeaders
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Status could be passed, failed, running, queued, etc.
            return Sanitizer.scrub(`Test run ${runId}: ${data.status}`);
        }
        catch (e) {
            return `[ERROR] Testkube API failed to get status: ${e.message}`;
        }
    }
};
K8sTestService = __decorate([
    Injectable()
], K8sTestService);
export { K8sTestService };
//# sourceMappingURL=k8s-test.service.js.map