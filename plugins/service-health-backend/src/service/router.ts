import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import { DatabaseHandler } from './DatabaseLayer';
import { refreshAllServices } from './serviceHealthLogic';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const dbHandler = await DatabaseHandler.create(options.database);
  router.use(express.json());

  router.get('/latest', async (_: Request, response: Response) => {
    const services = await refreshAllServices(dbHandler);
    response.json({ timestamp: Date.now().toString(), services });
  });

  router.get('/health', async (_: Request, response: Response) => {
    response.json({ status: 'ok' });
  });

  router.post('/health', async (_: Request, response: Response) => {
    response.json({ status: 'ok' });
  });

  router.patch('/health/:id', async (request: Request, response: Response) => {
    const { id } = request.params;
    const body = request.body;
    const count = await dbHandler.updateIncidentRecord(id, body);

    if (count) {
      response.json({ status: 'ok' });
    } else {
      response.status(404).json({ message: 'Record not found' });
    }
  });

  router.use(errorHandler());
  return router;
}
