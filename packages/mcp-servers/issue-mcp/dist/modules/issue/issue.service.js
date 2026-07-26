var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { Sanitizer } from '@omnitrace/sanitizer';
let IssueService = class IssueService {
    getAuthHeader() {
        const email = process.env.JIRA_EMAIL;
        const token = process.env.JIRA_API_TOKEN;
        if (!email || !token)
            throw new Error("Missing Jira credentials");
        return `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;
    }
    async createOrUpdate(project, title, desc, priority, traceId) {
        try {
            const baseUrl = process.env.JIRA_URL;
            if (!baseUrl)
                throw new Error("Missing JIRA_URL");
            // Simple implementation: Create new Jira issue. 
            // (Updating requires searching for an existing issue first, skipped for brevity)
            const priorityMap = {
                'P0': 'Highest',
                'P1': 'High',
                'P2': 'Medium'
            };
            let descriptionText = desc;
            if (traceId) {
                descriptionText += `\n\nTrace ID: ${traceId}`;
            }
            const response = await fetch(`${baseUrl}/rest/api/2/issue`, {
                method: 'POST',
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        project: { key: project },
                        summary: title,
                        description: descriptionText,
                        issuetype: { name: 'Task' },
                        // priority: { name: priority ? priorityMap[priority] : 'Medium' } // Assuming default Jira priorities
                    }
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }
            const data = await response.json();
            return Sanitizer.scrub(`[SUCCESS] Jira Issue Created: ${data.key}`);
        }
        catch (e) {
            return `[ERROR] Jira API failed: ${e.message}`;
        }
    }
};
IssueService = __decorate([
    Injectable()
], IssueService);
export { IssueService };
//# sourceMappingURL=issue.service.js.map