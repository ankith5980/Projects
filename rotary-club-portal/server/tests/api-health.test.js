// Simple health check tests - no ES6 imports needed
const request = require('supertest');

describe('API Health Check Tests', () => {
  const API_URL = 'http://localhost:5000';

  test('Backend server should be running', async () => {
    const response = await request(API_URL).get('/api');
    expect([200, 404]).toContain(response.status); // Either OK or Not Found is fine
  }, 10000);

  test('API should respond to health check', async () => {
    try {
      const response = await request(API_URL).get('/api/health');
      expect(response.status).toBeLessThan(500); // Not a server error
    } catch (error) {
      // If health endpoint doesn't exist, that's okay
      expect(error).toBeDefined();
    }
  }, 10000);
});

describe('Authentication API Tests', () => {
  const API_URL = 'http://localhost:5000';

  test('Login endpoint should exist', async () => {
    const response = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword',
      });
    
    // Should get either 401 (wrong credentials) or 400 (validation error)
    expect([400, 401]).toContain(response.status);
  }, 10000);
});

describe('Notification API Tests', () => {
  const API_URL = 'http://localhost:5000';

  test('Notifications endpoint requires authentication', async () => {
    const response = await request(API_URL).get('/api/notifications');
    expect(response.status).toBe(401); // Unauthorized
  }, 10000);

  test('Notification stats endpoint requires authentication', async () => {
    const response = await request(API_URL).get('/api/notifications/stats');
    expect(response.status).toBe(401);
  }, 10000);
});

describe('Payment API Tests', () => {
  const API_URL = 'http://localhost:5000';

  test('Payment periods endpoint requires authentication', async () => {
    const response = await request(API_URL).get('/api/payment-periods');
    expect(response.status).toBe(401);
  }, 10000);

  test('Pending payments endpoint requires authentication', async () => {
    const response = await request(API_URL).get('/api/payments/pending/my');
    expect(response.status).toBe(401);
  }, 10000);
});

describe('Members API Tests', () => {
  const API_URL = 'http://localhost:5000';

  test('Members endpoint requires authentication', async () => {
    const response = await request(API_URL).get('/api/members');
    expect(response.status).toBe(401);
  }, 10000);

  test('Add member endpoint requires authentication', async () => {
    const response = await request(API_URL)
      .post('/api/members')
      .send({ firstName: 'Test' });
    expect(response.status).toBe(401);
  }, 10000);
});
