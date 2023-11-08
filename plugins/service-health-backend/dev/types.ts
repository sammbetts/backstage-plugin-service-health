import { Logger } from 'winston';
import {
  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { IdentityApi } from '@backstage/plugin-auth-node';

export type PluginEnvironment = {
  logger: Logger;
  scheduler: PluginTaskScheduler;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  reader: UrlReader;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
};
