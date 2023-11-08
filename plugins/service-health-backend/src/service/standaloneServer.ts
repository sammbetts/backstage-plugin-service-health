import { createServiceBuilder, useHotMemoize } from '@backstage/backend-common';
import { Server } from 'http';
import knexFactory from 'knex';
import { Logger } from 'winston';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'service-health-backend' });
  logger.debug('Starting application server...');

  const db: any = useHotMemoize(module, () => {
    const knex = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });

    return knex;
  });

  const router = await createRouter({
    logger,
    database: { getClient: async () => db },
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/service-health', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
