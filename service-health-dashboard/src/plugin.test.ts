import { serviceHealthPlugin } from './plugin';

describe('service-health-dashboard', () => {
  it('should export plugin', () => {
    expect(serviceHealthPlugin).toBeDefined();
  });
});
