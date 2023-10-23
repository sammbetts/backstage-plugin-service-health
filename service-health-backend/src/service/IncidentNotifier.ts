import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { sendSlackNotification } from '../functions/sendSlackNotification';
import { refreshAllServices } from './serviceHealthLogic';
import { DatabaseHandler } from './DatabaseLayer';
import { convertToUKDateTimeFormat } from '../functions/dateTimeFunction';

export class IncidentNotifier {
  private readonly logger: Logger;
  private db?: DatabaseHandler;
  private slackWebhookUrl: string;

  constructor(logger: Logger, config: Config) {
    this.logger = logger;
    this.slackWebhookUrl = config.getString(
      'serviceHealth.slackWebhookUrl',
    );
  }

  async connect(database: PluginDatabaseManager) {
    this.db = await DatabaseHandler.create(database);
  }
  async run(): Promise<{ services: any[] }> {
    if (!this.db) {
      this.logger.error(
        "Can't handle incidents, not connected to the database",
      );
      return { services: [] };
    }
    try {
      const healthData = await refreshAllServices(this.db);
      const newIncidents: any[] = [];

      for (const service of healthData) {
        for (const incident of service.incidents) {
          if (await this.isIncidentNew(incident.id)) {
            incident.serviceName = service.serviceName;
            incident.componentName = service.incidentComponents;
            incident.updated = convertToUKDateTimeFormat(
              incident.modified || incident.updated_at || incident.date_updated,
            );
            newIncidents.push(incident);
          }
        }
      }
      if (newIncidents.length > 0) {
        await this.logIncidents(newIncidents);
      }
      return {
        services: newIncidents,
      };
    } catch (error) {
      this.logger.error(`Error while fetching health data: ${(error as Error).message}`);
      return { services: [] };
    }
  }

  private async isIncidentNew(incidentId: string): Promise<boolean> {
    const existingIncident = await this.db?.getIncident(incidentId);
    return !existingIncident;
  }

  async logIncidents(incidents: any[]): Promise<void> {
    for (const incident of incidents) {
      try {
        const incidentNameOptions = [
          incident.service_name,
          incident.componentName,
          incident.services,
        ];
        let incidentName = '';
        for (const option of incidentNameOptions) {
          if (option) {
            incidentName = option;
            break;
          }
        }
        await sendSlackNotification(
          incident.serviceName,
          incidentName,
          incident.updated,
          this.slackWebhookUrl,
        );
        await this.db?.createIncidentRecord(incident.id);
      } catch (error) {
        this.logger.error(
          `Failed to send Slack notification for incident ID: ${incident.id}`,
        );
      }
    }
  }
}
