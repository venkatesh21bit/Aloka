The **Model Context Protocol (MCP)** standardizes how the central AI orchestrator interfaces with external tools through a client-server JSON-RPC architecture. Rather than writing custom API wrappers for every platform, OmniTrace uses standard **MCP Tools** (executable functions), **MCP Resources** (read-only data streams), and **JSON Schema validation**.

---

## 1. `ci-mcp` (CI/CD Pipeline Interceptor)

* **Primary Function:** Receives pipeline event webhooks, fetches execution logs, and isolates specific step failures.
* **Underlying Stack:** Node.js / TypeScript wrapping GitHub Actions REST API, GitLab CI API, and CircleCI v2 API. Communicates over `stdio` or HTTP/SSE.

### Exposed MCP Tools & Signatures

* `get_failed_job_logs`: Retrieves console output for a specific failed pipeline run, automatically trimming noise to focus on non-zero exit code steps.
```json
{
  "name": "get_failed_job_logs",
  "description": "Fetch log output for a failed CI job run",
  "parameters": {
    "type": "object",
    "properties": {
      "job_id": { "type": "string" },
      "tail_lines": { "type": "integer", "default": 200 },
      "step_filter": { "type": "string", "description": "e.g., 'integration-test'" }
    },
    "required": ["job_id"]
  }
}

```


* `get_pipeline_context`: Returns metadata associated with the build failure (e.g., commit SHA, author, environment variables, PR number).

### Exposed MCP Resources

* `ci://pipeline/{run_id}/raw-logs`: A passive, read-only stream containing unredacted raw build logs for deep context lookup.

---

## 2. `otel-mcp` (Observability & Distributed Tracing)

* **Primary Function:** Connects to APM backends (Grafana Tempo, Jaeger, Elastic APM) to trace failed requests across microservice boundaries using W3C Trace Context standards.
* **Underlying Stack:** Python / Go server querying Tempo TraceQL or Jaeger HTTP Query APIs. It converts raw JSON telemetry waterfalls into concise stack traces for the LLM.

### Exposed MCP Tools & Signatures

* `get_trace_spans`: Queries the APM collector for a specific `trace_id` and isolates spans marked with `Status: Error` or containing exception attributes.
```json
{
  "name": "get_trace_spans",
  "description": "Filter spans by trace ID to extract root-cause error details",
  "parameters": {
    "type": "object",
    "properties": {
      "trace_id": { "type": "string" },
      "filter_status": { "type": "string", "enum": ["ALL", "ERROR"], "default": "ERROR" }
    },
    "required": ["trace_id"]
  }
}

```


* `get_service_dependency_graph`: Maps upstream callers and downstream targets involved in a failed transaction to verify which microservice interface broke contract.

### Exposed MCP Resources

* `otel://traces/{trace_id}/waterfall`: Structural JSON representation of the entire microservice call hierarchy.

---

## 3. `browser-mcp` (Frontend Visual & DOM Diagnostics)

* **Primary Function:** Drives a headless Chrome instance via Chrome DevTools Protocol (CDP) or Playwright to inspect frontend application states, capture UI failures, and extract browser logs.
* **Underlying Stack:** Node.js using `@modelcontextprotocol/server-puppeteer` / Playwright.

### Exposed MCP Tools & Signatures

* `capture_viewport_screenshot`: Replays user steps on a target route, takes a screenshot upon layout crash or error boundary, and returns visual context.
* `inspect_dom_element`: Retrieves CSS, element geometry, and DOM attributes for broken elements (e.g., unclickable buttons, missing fields).
```json
{
  "name": "inspect_dom_element",
  "description": "Inspect DOM node attributes and console errors at failure URL",
  "parameters": {
    "type": "object",
    "properties": {
      "url": { "type": "string" },
      "css_selector": { "type": "string" },
      "capture_console_errors": { "type": "boolean", "default": true }
    },
    "required": ["url"]
  }
}

```



---

## 4. `slack-mcp` (ChatOps & Human-in-the-Loop)

* **Primary Function:** Manages interactive Slack/Teams communications—posting diagnostic summaries, capturing developer button clicks, and hosting conversational debugging threads.
* **Underlying Stack:** Python / TypeScript using Slack Bolt SDK over Socket Mode.

### Exposed MCP Tools & Signatures

* `post_interactive_alert`: Formats and delivers a rich Block Kit message to designated developer channels containing the root cause analysis, trace link, and fix options.
```json
{
  "name": "post_interactive_alert",
  "description": "Post interactive incident response card to Slack",
  "parameters": {
    "type": "object",
    "properties": {
      "channel_id": { "type": "string" },
      "rca_summary": { "type": "string" },
      "diff_patch": { "type": "string" },
      "trace_url": { "type": "string" },
      "action_buttons": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["channel_id", "rca_summary", "diff_patch"]
  }
}

```


* `update_thread_message`: Appends progress updates, test run results, or revised code diffs to an ongoing incident thread.

---

## 5. `issue-mcp` (Issue Tracking & Board Management)

* **Primary Function:** Syncs incident status across project management platforms (Linear, Jira, GitHub Issues), ensuring issue cards reflect real-time diagnostic data.
* **Underlying Stack:** TypeScript server consuming Linear GraphQL API or Jira REST API v3.

### Exposed MCP Tools & Signatures

* `create_or_update_issue`: Auto-generates a structured bug ticket linked to the trace ID, attaching logs, stack traces, and proposed hotfix PR links.
```json
{
  "name": "create_or_update_issue",
  "description": "Create or update issue ticket in Linear/Jira",
  "parameters": {
    "type": "object",
    "properties": {
      "project_key": { "type": "string" },
      "title": { "type": "string" },
      "description": { "type": "string" },
      "priority": { "type": "string", "enum": ["P0", "P1", "P2"] },
      "trace_id": { "type": "string" }
    },
    "required": ["project_key", "title", "description"]
  }
}

```



---

## 6. `k8s-test-mcp` (Targeted Ephemeral Verification)

* **Primary Function:** Connects to Kubernetes and Testkube APIs to launch isolated, ephemeral pods that run integration and regression suites against generated patches before code commits occur.
* **Underlying Stack:** Go / Python using official Kubernetes Client Library and Testkube REST API.

### Exposed MCP Tools & Signatures

* `run_ephemeral_test_suite`: Deploys a temporary container configured with the proposed patch diff to run targeted test blocks (e.g., `payment-service-integration-tests`).
```json
{
  "name": "run_ephemeral_test_suite",
  "description": "Execute targeted integration tests in an ephemeral K8s pod",
  "parameters": {
    "type": "object",
    "properties": {
      "suite_name": { "type": "string" },
      "patch_diff": { "type": "string" },
      "target_namespace": { "type": "string", "default": "omnitrace-sandbox" }
    },
    "required": ["suite_name", "patch_diff"]
  }
}

```


* `get_test_execution_status`: Polls running Testkube execution status and collects pass/fail results and stdout logs.

---

## 7. `git-mcp` (Version Control & SCM Ops)

* **Primary Function:** Interacts directly with GitHub/GitLab repositories to inspect file history, apply code modifications, branch code, and submit Pull Requests.
* **Underlying Stack:** Node.js (`@modelcontextprotocol/server-github`) or Python (`gitpython` / GitHub GraphQL).

### Exposed MCP Tools & Signatures

* `read_file_at_commit`: Fetches exact file contents at a given commit SHA to give the LLM agent precise source code context.
* `create_branch_and_pr`: Creates a new git branch (e.g., `omnitrace/fix-currency-code`), applies the verified patch, and submits a Pull Request with complete diagnostic context.
```json
{
  "name": "create_branch_and_pr",
  "description": "Stage fix, create branch, and open Pull Request",
  "parameters": {
    "type": "object",
    "properties": {
      "repo_slug": { "type": "string" },
      "base_branch": { "type": "string", "default": "main" },
      "new_branch": { "type": "string" },
      "file_changes": { 
        "type": "array", 
        "items": { 
          "type": "object", 
          "properties": { "path": { "type": "string" }, "content": { "type": "string" } } 
        } 
      },
      "pr_title": { "type": "string" },
      "pr_body": { "type": "string" }
    },
    "required": ["repo_slug", "new_branch", "file_changes", "pr_title"]
  }
}

```



---