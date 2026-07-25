import { z } from 'zod';

export const WebhookPayloadSchema = z.object({
  repository_url: z.string().url(),
  branch_name: z.string(),
  commit_sha: z.string(),
  failing_job_id: z.string(),
  author: z.string().optional(),
  timestamp: z.string().datetime().optional()
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
