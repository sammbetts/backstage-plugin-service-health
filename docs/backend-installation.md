# Backend Installation

Add the package to your backendend application:

```bash
npm install @sammbetts/backstage-plugin-service-health-backend
```

Create a file called 'service-health.ts' in `packages/backend/src/plugins`

```ts
import { Router } from 'express';
import { createRouter } from '@internal/plugin-service-health-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    database: env.database,
  });
}
```

With the service-health.ts router setup in place, add the router to `packages/backend/src/index.ts`

```diff
+import serviceHealth from './plugins/service-health';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+ const serviceHealthEnv = useHotMemoize(module, () => createEnv('service-health'),
  );

  const apiRouter = Router();
+  apiRouter.use('/service-health', await serviceHealh(serviceHealthEnv));
  ...
  apiRouter.use(notFoundHandler());
```

## Enabling Slack Notifications

To enable Slack notifications for new incidents, you will need to add your Slack webhook URL to app-config.yaml:

```yaml
serviceHealth:
  slackWebhookUrl: ${SERVICE-HEALTH-SLACK-WEBHOOK-URL}
```

Then add the following code to packages/backend/src/index.ts:

```ts
  function isValidHttpUrl(possible_url: string) {
    try {
      const newUrl = new URL(possible_url);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  const slackWebhookUrl = config.getOptionalString(
    'serviceHealth.slackWebhookUrl',
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
      'serviceHealth.slackWebhookUrl is not a valid URL in Config, service health notifications will be disabled.',
    );
  } else {
    logger.warn(
      'serviceHealth.slackWebhookUrl not defined in config, service health notifications will be disabled.',
    );
  }
```

This code ensures that the Slack URL is set and is a valid URL before executing the notifications.
