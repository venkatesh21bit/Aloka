export interface GraphState {
  status: 'PENDING' | 'DIAGNOSING' | 'PATCHING' | 'APPROVED' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
  pipelineContext?: {
    repository_url: string;
    branch_name: string;
    commit_sha: string;
    failing_job_id: string;
  };
  jobLogs?: string;
  traceId?: string;
  traceSpans?: string;
  domErrors?: string;
  rcaSummary?: string;
  patchDiff?: string;
  slackThreadId?: string;
  error?: string;
}
