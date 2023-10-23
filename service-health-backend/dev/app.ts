import { Router } from 'express';
import { createRouter } from '@backstage/plugin-app-backend';
import { PluginEnvironment } from '../dev/types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    appPackageName: 'app',
  });
}
