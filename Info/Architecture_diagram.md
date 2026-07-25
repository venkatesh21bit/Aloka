Here is the component and data-flow architecture for **OmniTrace**, showing how the central agent orchestrator interacts with the federated network of MCP servers and underlying platforms.

```text
+---------------------------------------------------------------------------------------+
|                                EVENT & INGESTION LAYER                                |
|                                                                                       |
|   [ GitHub Actions ]          [ GitLab CI/CD ]          [ CircleCI ]                  |
|           |                          |                       |                        |
|           +--------------------------+-----------------------+                        |
|                                      | HTTP Failure Webhook                           |
+--------------------------------------|------------------------------------------------+
                                       v
+---------------------------------------------------------------------------------------+
|                             OMNITRACE CORE ORCHESTRATOR                               |
|                                                                                       |
|   +---------------------+      +---------------------+      +---------------------+   |
|   |  Webhook Receiver   | ---> | Data Sanitizer      | ---> |  Diagnostic Agent   |   |
|   |  (HMAC Auth)        |      | (Redact Secrets/PII)|      |  (State Machine)    |   |
|   +---------------------+      +---------------------+      +----------+----------+   |
|                                                                        |              |
|                                                                        v              |
|   +---------------------+      +---------------------+      +---------------------+   |
|   | Git & PR Controller | <--- | Fix Verifier Agent  | <--- | Patch Synthesizer   |   |
|   | (Auto-PR Engine)    |      | (Test Evaluator)    |      | (LLM Code Engine)   |   |
|   +---------------------+      +---------------------+      +---------------------+   |
+----------------------------------------|----------------------------------------------+
                                         | JSON-RPC Protocol over SSE / stdio
                                         v
+---------------------------------------------------------------------------------------+
|                              FEDERATED MCP SERVER LAYER                               |
|                                                                                       |
|  +------------+ +------------+ +-------------+ +-----------+ +-----------+ +--------+ |
|  |   ci-mcp   | |  otel-mcp  | | browser-mcp | | slack-mcp | | issue-mcp | |  ...   | |
|  +-----+------+ +-----+------+ +------+------+ +-----+-----+ +-----+-----+ +---+----+ |
+--------|--------------|---------------|--------------|-------------|---------|--------+
         |              |               |              |             |         |
         |              |               |              |             |         +--------+
         v              v               v              v             v                  v
+---------------------------------------------------------------------------------------+
|                             EXTERNAL TARGET INFRASTRUCTURE                            |
|                                                                                       |
|  [ CI/CD APIs ] [ APM/Tempo ]  [ Playwright ]   [ Slack API ]  [ Linear/Jira ] [ K8s/Testkube ]
|  (Build Logs)   (Traces/Spans) (DOM/Console)    (ChatOps UI)   (Tickets)       (Ephemeral Runs)
+---------------------------------------------------------------------------------------+

```

---

## Architectural Breakdown by Component

### 1. Event & Ingestion Layer

* **Webhook Receiver:** Exposes an authenticated REST endpoint with HMAC signature validation to verify incoming build failure notifications from GitHub, GitLab, or CircleCI.
* **Data Sanitizer:** Parses payloads prior to processing, stripping out authorization headers, personal data, and environment secrets (`.env` values, private tokens) using regex-based entropy filters.

### 2. Omnitrace Core Orchestrator

* **Diagnostic Agent (State Machine):** Drives the diagnostic loop. It decides which MCP tools to invoke based on available failure context (e.g., calling `ci-mcp` first, then referencing `otel-mcp` if a trace ID is detected).
* **Patch Synthesizer:** Receives isolated logs, trace spans, and source files, passing them to an LLM context window to craft targeted bug fixes.
* **Fix Verifier & PR Controller:** Orchestrates pre-commit testing through `k8s-test-mcp` and handles branch creation and pull request submission via `git-mcp`.

### 3. Federated MCP Server Layer (JSON-RPC)

The orchestrator acts as an **MCP Client**, delegating domain-specific operations to isolated MCP servers:

* **`ci-mcp` & `otel-mcp`:** Handle read-only retrieval of execution logs and distributed trace cascades from APM backends (Tempo/Jaeger).
* **`browser-mcp`:** Launches headless Chrome sessions to verify UI errors and DOM layout failures.
* **`slack-mcp` & `issue-mcp`:** Manage the human-in-the-loop interaction by pushing dynamic Block Kit messages to Slack and creating tickets in Linear or Jira.
* **`k8s-test-mcp` & `git-mcp`:** Perform state-changing actions—running ephemeral verification pods on Kubernetes (via Testkube) and managing git branches.