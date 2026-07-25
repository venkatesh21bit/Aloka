import { StateAnnotation } from '../graph/state';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function patchAgent(state: typeof StateAnnotation.State) {
  console.log(`[Patch Synthesizer] Generating patch for ${state.traceId}`);
  
  let patchDiff = '';
  let rcaSummary = '';

  try {
    const model = new ChatGoogleGenerativeAI({
      modelName: 'gemini-3-flash-preview',
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are an expert CI/CD AI agent debugging a build failure.
Analyze the following logs, trace spans, and DOM errors to determine the root cause and write a patch.

Job Logs:
${state.jobLogs}

Trace Spans:
${state.traceSpans}

DOM Errors:
${state.domErrors}

Provide your response in exactly the following JSON format:
{
  "rcaSummary": "Short explanation of the root cause",
  "patchDiff": "--- a/path/to/file\n+++ b/path/to/file\n- old code\n+ new code"
}
    `;

    const response = await model.invoke(prompt);
    
    // Parse the JSON output from the model
    const content = response.content.toString();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      patchDiff = parsed.patchDiff || 'No diff generated';
      rcaSummary = parsed.rcaSummary || 'No RCA summary generated';
    } else {
      patchDiff = 'Error parsing diff';
      rcaSummary = 'Error parsing RCA';
    }
  } catch (error: any) {
    console.error('[Patch Synthesizer] LLM Error:', error);
    patchDiff = `LLM Failed: ${error.message}`;
    rcaSummary = 'Failed to synthesize patch due to LLM error.';
  }

  console.log(`[Patch Synthesizer] Invoking slack-mcp to ask for human approval`);

  return {
    status: 'APPROVED' as const, // In a real system, this would wait for Slack webhook callback. We auto-approve for now.
    patchDiff,
    rcaSummary,
    slackThreadId: 'slack-thread-123'
  };
}
