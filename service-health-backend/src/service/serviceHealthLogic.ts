import axios from 'axios';
import { DatabaseHandler } from './DatabaseLayer';

interface GoogleIncident {
  id: string;
  service_name: string;
  external_desc: string;
  status_impact: string;
  modified: string;
  uri: string;
  end: string;
}

interface Incident {
  id: string;
  incidentServiceName: string;
  incidentStatus: string;
  incidentUpdated: string;
  incidentLink: string;
  components?: string[];
}

interface ServiceResponse {
  serviceName: string;
  status?: string;
  updated: string;
  link: string;
  incidents: Incident[];
  incidentComponents?: string[];
  uri?: string;
}

const fetchDataFromAPI = async (apiUrl: string): Promise<ServiceResponse> => {
  const response = await axios.get(apiUrl);
  const { status, page, incidents } = response.data;

  return {
    serviceName: page.name,
    status: status.description,
    updated: page.updated_at,
    link: page.url,
    incidents: incidents,
    incidentComponents: incidents.map(
      (incident: any) => incident.components[0].name,
    ),
  };
};

const fetchDataFromGoogleAPI = async (
  incidentSource: string,
  apiUrl: string,
  link: string,
  uri: string,
): Promise<ServiceResponse> => {
  const response = await axios.get(apiUrl);
  const incidents = response.data;
  const ongoingIncidents = incidents.filter(
    (incident: GoogleIncident) => !incident.end,
  );
  for (const incident of ongoingIncidents) {
    incident.incident_source = incidentSource;
  }
  return {
    serviceName: incidentSource,
    updated: new Date().toISOString(),
    link: link,
    incidents: ongoingIncidents,
    uri: uri,
  };
};

const fetchDataFromSlackAPI = async (
  apiUrl: string,
): Promise<ServiceResponse> => {
  const response = await axios.get(apiUrl);
  const { status, active_incidents, date_updated } = response.data;

  return {
    serviceName: 'Slack',
    status: status,
    updated: date_updated,
    link: 'https://status.slack.com/',
    incidents: active_incidents,
  };
};

export async function refreshAllServices(_: DatabaseHandler): Promise<any> {
  const circleCIIncidents = fetchDataFromAPI(
    'https://status.circleci.com/api/v2/summary.json',
  );
  const cloudflareIncidents = fetchDataFromAPI(
    'https://www.cloudflarestatus.com/api/v2/summary.json',
  );
  const compassIncidents = fetchDataFromAPI(
    'https://compass.status.atlassian.com/api/v2/summary.json',
  );
  const confluenceIncidents = fetchDataFromAPI(
    'https://confluence.status.atlassian.com/api/v2/summary.json',
  );
  const dataDogIncidents = fetchDataFromAPI(
    'https://status.datadoghq.com/api/v2/summary.json',
  );
  const gitHubIncidents = fetchDataFromAPI(
    'https://www.githubstatus.com/api/v2/summary.json',
  );
  const googleCloudIncidents = fetchDataFromGoogleAPI(
    'Google Cloud Platform',
    'https://status.cloud.google.com/incidents.json',
    'https://status.cloud.google.com/',
    'https://status.cloud.google.com/',
  );
  const googleWorkspaceIncidents = fetchDataFromGoogleAPI(
    'Google Workspace',
    'https://www.google.com/appsstatus/dashboard/incidents.json',
    'https://www.google.com/appsstatus/dashboard/',
    'https://www.google.com/appsstatus/dashboard/incidents',
  );
  const hashiCorpIncidents = fetchDataFromAPI(
    'https://status.hashicorp.com/api/v2/summary.json',
  );
  const jiraIncidents = fetchDataFromAPI(
    'https://jira-software.status.atlassian.com/api/v2/summary.json',
  );
  const opsGenieIncidents = fetchDataFromAPI(
    'https://opsgenie.status.atlassian.com/api/v2/summary.json',
  );
  const robinIncidents = fetchDataFromAPI(
    'https://status.robinpowered.com/api/v2/summary.json',
  );
  const slackIncidents = fetchDataFromSlackAPI(
    'https://status.slack.com/api/v2.0.0/current',
  );
  const statusPageIncidents = fetchDataFromAPI(
    'https://metastatuspage.com/api/v2/summary.json',
  );
  const vercelPageIncidents = fetchDataFromAPI(
    'https://www.vercel-status.com/api/v2/summary.json',
  );
  const wizIncidents = fetchDataFromAPI(
    'https://status.wiz.io/api/v2/summary.json',
  );

  const responses = await Promise.allSettled([
    circleCIIncidents,
    cloudflareIncidents,
    compassIncidents,
    confluenceIncidents,
    dataDogIncidents,
    gitHubIncidents,
    googleCloudIncidents,
    googleWorkspaceIncidents,
    hashiCorpIncidents,
    jiraIncidents,
    opsGenieIncidents,
    robinIncidents,
    slackIncidents,
    statusPageIncidents,
    vercelPageIncidents,
    wizIncidents,
  ]);

  const fulfilledResponses = responses.filter(
    (response): response is PromiseFulfilledResult<ServiceResponse> =>
      response.status === 'fulfilled',
  );

  return fulfilledResponses.map(response => response.value);
}
