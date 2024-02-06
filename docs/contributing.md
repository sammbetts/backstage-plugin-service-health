# Contributing

## Backend

To add a service to the dashboard, firstly add the summary API to `service-health-backend/src/service/ServiceHealthLogic.ts` under the `refreshAllServices` function:

```ts
  const <INSERT_NAME>Incidents = fetchDataFromAPI(
    '<STATUS_SUMMARY_URL',
  );
```

Then add the service to the list of responses below that.

## Frontend

You then need to add the icon png for the new service in the `service-health-dashboard/src/assests` folder, and import into `service-health-dashboard/src/ServiceHealthPage/ServiceHealthPage.tsx`

Then add your icon to the list of icons, making sure the name you use is identical to how the service 'name' is defined in the API, e.g:

```tsx
const icons = {
...
'Datadog US1': DataDog,
...
};
```
