import {
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-service-health-backend',
  'migrations',
);

const TABLE_NAME = 'incident_record';

export class DatabaseHandler {
  static async create(
    database: PluginDatabaseManager,
  ): Promise<DatabaseHandler> {
    const client: any = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseHandler(client);
  }

  private readonly client: Knex;

  private constructor(client: Knex) {
    this.client = client;
  }

  getIncident = async (incidentId: string) => {
    const [incident] = await this.client
      .select()
      .from(TABLE_NAME)
      .where('incident_id', incidentId)
      .limit(1);

    return incident;
  };

  createIncidentRecord = async (incidentId: string) => {
    await this.client
      .insert({
        incident_id: incidentId,
        sent: false,
      })
      .into(TABLE_NAME);
  };

  updateIncidentRecord = async (id: string, sent: boolean) => {
    return await this.client(TABLE_NAME).where({ incident_id: id }).update({
      sent,
    });
  };
}
