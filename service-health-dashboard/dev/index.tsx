import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  serviceHealthPlugin,
  ServiceHealthDashboardPage,
  ServiceHealthOverviewCard,
} from '../src/index';

createDevApp()
  .registerPlugin(serviceHealthPlugin)
  .addPage({
    element: <ServiceHealthDashboardPage />,
    title: 'Service Health',
    path: '/service-health',
  })
  .addPage({
    element: (
      <div style={{ width: '550px', margin: '10px' }}>
        <ServiceHealthOverviewCard title={'Status Overview'} />
      </div>
    ),
    title: 'Card',
    path: '/card',
  })
  .render();
