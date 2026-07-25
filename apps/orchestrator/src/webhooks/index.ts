import express from 'express';
import { WebhookPayloadSchema } from '@omnitrace/schemas';
import { logger } from '@omnitrace/logger';
import { createGraph } from '../graph';

export const webhookRouter = express.Router();

webhookRouter.post('/github', async (req, res) => {
  try {
    const payload = WebhookPayloadSchema.parse(req.body);
    logger.info(`Received webhook for ${payload.repository_url}`);

    // Acknowledge the webhook immediately so GitHub Actions (or curl) doesn't hang
    res.status(202).json({ message: 'Incident processing started in the background' });

    const graph = createGraph();
    // Execute the graph asynchronously
    graph.invoke({
      status: 'DIAGNOSING',
      pipelineContext: {
        repository_url: payload.repository_url,
        branch_name:    payload.branch_name,
        commit_sha:     payload.commit_sha,
        failing_job_id: payload.failing_job_id,
        run_id:         payload.run_id,
        owner:          payload.owner,
        repo:           payload.repo,
      }
    }).then(finalState => {
      logger.info('Incident processed successfully');
    }).catch(err => {
      logger.error({ err }, 'Background graph execution failed');
    });
  } catch (err) {
    logger.error({ err }, 'Webhook processing failed');
    res.status(400).json({ error: 'Invalid payload' });
  }
});
