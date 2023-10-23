import express from 'express';
import request from 'supertest';
import { getVoidLogger } from '@backstage/backend-common';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const mockDatabaseService = {
      getClient: jest.fn(),
      migrations: {
        skip: true,
      },
    };
    const router = await createRouter({
      logger: getVoidLogger(),
      database: mockDatabaseService as any,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
