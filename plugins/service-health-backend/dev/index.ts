import Router from 'express-promise-router';
import {
  CacheManager,
  createServiceBuilder,
  DatabaseManager,
  getRootLogger,
  HostDiscovery,
  loadBackendConfig,
  ServerTokenManager,
  UrlReaders,
  useHotMemoize,
} from '@backstage/backend-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';

import { IncidentNotifier } from '../../service-health-backend/src/service/IncidentNotifier';
import serviceHealth from '../dev/service-health';
import { PluginEnvironment } from './types';
import app from './app';

function makeCreateEnv(config: Config) {
    const root = getRootLogger();
    const reader = UrlReaders.default({ logger: root, config });
    const discovery = HostDiscovery.fromConfig(config);
    const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
    const permissions = ServerPermissionClient.fromConfig(config, {
      discovery,
      tokenManager,
    });
    const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
    const cacheManager = CacheManager.fromConfig(config);
    const taskScheduler = TaskScheduler.fromConfig(config, { databaseManager });
    const identity = DefaultIdentityClient.create({
      discovery,
    });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);

    return {
        logger,
        cache,
        database,
        config,
        reader,
        discovery,
        tokenManager,
        permissions,
        scheduler,
        identity,
    };
  };
}

async function main() {
  const logger = getRootLogger();
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: logger,
    remote: {
      reloadIntervalSeconds: 60 * 10, // Check remote config changes every 10 minutes.
    },
  });

  const createEnv = makeCreateEnv(config);
  const apiRouter = Router();
  const appEnv = useHotMemoize(module, () => createEnv('app'));

  const serviceHealthEnv = useHotMemoize(module, () =>
    createEnv('service-health'),
  );
  apiRouter.use('/service-health', await serviceHealth(serviceHealthEnv));

  // Optional to enable service health notifications
  function isValidHttpUrl(possible_url: string) {
    try {
      const newUrl = new URL(possible_url);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  const slackWebhookUrl = config.getOptionalString(
    'ovo.serviceHealth.slackWebhookUrl',
  );

  if (slackWebhookUrl && isValidHttpUrl(slackWebhookUrl)) {
    const incidentNotifications = new IncidentNotifier(logger, config);
    await incidentNotifications.connect(serviceHealthEnv.database);

    await serviceHealthEnv.scheduler.scheduleTask({
      id: 'run_refresh_all_services',
      frequency: { cron: '*/20 * * * *' }, // Every 20 minutes
      timeout: { minutes: 5 },
      fn: async () => {
        await incidentNotifications.run();
      },
    });
  } else if (slackWebhookUrl) {
    logger.error(
      'ovo.serviceHealth.slackWebhookUrl is not a valid URL in Config, service health notifications will be disabled.',
    );
  } else {
    logger.warn(
      'ovo.serviceHealth.slackWebhookUrl not defined in config, service health notifications will be disabled.',
    );
  }

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
