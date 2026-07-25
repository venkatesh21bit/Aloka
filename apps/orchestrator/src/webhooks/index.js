import express from 'express';
import { WebhookPayloadSchema } from '@omnitrace/schemas';
import { logger } from '@omnitrace/logger';
import { createGraph } from '../graph';
export const webhookRouter = express.Router();
webhookRouter.post('/github', async (req, res) => {
    try {
        const payload = WebhookPayloadSchema.parse(req.body);
        logger.info(`Received webhook for ${payload.repository_url}`);
        const graph = createGraph();
        const finalState = await graph.invoke({
            status: 'DIAGNOSING',
            pipelineContext: {
                repository_url: payload.repository_url,
                branch_name: payload.branch_name,
                commit_sha: payload.commit_sha,
                failing_job_id: payload.failing_job_id
            }
        });
        res.json({ message: 'Incident processed successfully', finalState });
    }
    catch (err) {
        logger.error({ err }, 'Webhook processing failed');
        res.status(400).json({ error: 'Invalid payload' });
    }
});
