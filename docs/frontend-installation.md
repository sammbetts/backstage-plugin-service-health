# Frontend Installation

Add the package to your frontend application:

```bash
npm install @sammbetts/backstage-plugin-service-health
```

Modify your app routes in `packages/app/src/App.tsx`:

```diff
+ import { ServiceHealthDashboardPage } from '@sammbetts/backstage-plugin-service-health-dashboard';

const routes = (

  <FlatRoutes>
    ...
+   <Route path="/service-health" element={<ServiceHealthDashboardPage />} />
    ...
  </FlatRoutes>
);
```

Add the **Service Health** icon to the Sidebar in `packages/app/src/components/Root/Root.tsx`:

```diff
+ import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

  <SidebarGroup label="Menu" icon={<MenuIcon />}>
    ...
+   <SidebarItem icon={CheckCircleOutlineIcon} to="service-health" text="Service Health" />
    ...
  </SideGroup>
```

To use the Card component, add to your home/landing page:

```ts
import { ServiceHealthOverviewCard } from '@sammbetts/backstage-plugin-service-health';

...
<Grid item>
  <ServiceHealthOverviewCard title="Status Overview"/>
</Grid>
...
```
