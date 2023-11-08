import { createRouter } from '../../service-health-backend/src/service/router';
import { Router } from 'express';
import { PluginEnvironment } from '../dev/types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    database: env.database,
  });
}