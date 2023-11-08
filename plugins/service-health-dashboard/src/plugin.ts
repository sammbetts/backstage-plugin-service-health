import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const serviceHealthPlugin = createPlugin({
  id: 'service-health-dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const ServiceHealthDashboardPage = serviceHealthPlugin.provide(
  createRoutableExtension({
    name: 'ServiceHealthDashboardPage',
    component: () =>
      import('./ServiceHealthPage').then(m => m.ServiceHealthDashboardPage),
    mountPoint: rootRouteRef,
  }),
);
