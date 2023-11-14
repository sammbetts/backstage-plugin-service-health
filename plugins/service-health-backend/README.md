# Backstage Plugin: service-health-backend

Welcome to the service health plugin for [Backstage!](https://backstage.io/)

This plugin displays the status and active incidents of third party services directly in Backstage.

## Plugin Features

- This plugin uses the third party services public status API.
- Real time display of services current status.
- If an active incident is happening the drop down will appear to display more details.
- Only the most recent incident update message is displayed.
- Links to the services full public dashboards and to the specific ongoing incident.
- A Card component to display an overview of the status's on the homepage.
- Ability to enable slack notifications for alerting of new incidents.

## Backend Installation

After installing the [service-health-dashboard](https://www.npmjs.com/package/backstage-plugin-service-health-dashboard),
add the backend package to your backend application:

```bash
yarn add @sammbetts/backstage-plugin-service-health-backend
```

Create a file called 'service-health.ts' in `packages/backend/src/plugins`

```ts
import { Router } from 'express';
import { createRouter } from '@sammbetts/plugin-service-health-backend';
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

_See [Slack api page](https://api.slack.com/apps) for info on creating your slack app with webhook._

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