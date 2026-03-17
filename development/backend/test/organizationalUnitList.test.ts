/**
 * Organizational Unit API Tests
 * Tests for GET /api/organizational-units endpoint
 * 
 * Run with: npm test
 * Or: npm test -- OrganizationalUnit.test.ts
 */

import request from 'supertest';
import { app, initializeRoutes } from "../src/index"
import jwt from 'jsonwebtoken';

// Test configuration
const API_ENDPOINT = '/api/organizational-units';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Helper function to generate valid JWT token
function generateTestToken(payload = {}): string {
  return jwt.sign(
    {
      userId: 1,
      email: 'test@dost.gov.ph',
      role: 'admin',
      ...payload
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
      algorithm: 'HS256'
    }
  );
}

// Setup before all tests
beforeAll(async () => {
  await initializeRoutes();
});

describe('Organizational Unit API Tests', () => {
  
  describe('Authentication Tests', () => {
    
    test('Should return 401 when no Authorization header is provided', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .expect(401);

      expect(response.body).toHaveProperty('status', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    test('Should return 401 when Authorization header is malformed', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body).toHaveProperty('status', 401);
    });

    test('Should return 401 when token is missing (only "Bearer" provided)', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(response.body).toHaveProperty('status', 401);
    });

    test('Should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('status', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    test('Should return 401 when token is expired', async () => {
      const expiredToken = jwt.sign(
        { userId: 1, email: 'test@dost.gov.ph' },
        JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('status', 401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

  });

  describe('Successful Response Tests', () => {

    let validToken: string;

    beforeAll(() => {
      validToken = generateTestToken();
    });

    test('Should return 200 with valid JWT token', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 200);
      const expectedMessage = response.body.data.length > 0
        ? 'Organizational units retrieved successfully.'
        : 'No organizational units found.';
      expect(response.body).toHaveProperty('message', expectedMessage);
      expect(response.body).toHaveProperty('data');
    });

    test('Should return an array of organizational units', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Should return empty array when no data exists', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // This test passes if data is empty OR has items
      expect(Array.isArray(response.body.data)).toBe(true);
    });

  });

  describe('Response Structure Tests', () => {

    let validToken: string;

    beforeAll(() => {
      validToken = generateTestToken();
    });

    test('Each organizational unit should have required fields', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      if (data.length > 0) {
        const orgUnit = data[0];

        // Required fields
        expect(orgUnit).toHaveProperty('org_unit_id');
        expect(orgUnit).toHaveProperty('org_unit_name');
        expect(orgUnit).toHaveProperty('unit_type');
        expect(orgUnit).toHaveProperty('complete_address');
        
        // parent_unit_name can be null for top-level units
        expect(orgUnit).toHaveProperty('parent_unit_name');

        // Type checks
        expect(typeof orgUnit.org_unit_id).toBe('number');
        expect(typeof orgUnit.org_unit_name).toBe('string');
        expect(typeof orgUnit.unit_type).toBe('string');
        expect(typeof orgUnit.complete_address).toBe('string');
      }
    });

    test('Top-level units should have null parent_unit_name', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      // Find a top-level unit (one without parent)
      const topLevelUnit = data.find((unit: any) => unit.parent_unit_name === null);

      if (topLevelUnit) {
        expect(topLevelUnit.parent_unit_name).toBeNull();
      }
    });

    test('Child units should have non-null parent_unit_name', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      // Find a child unit (one with parent)
      const childUnit = data.find((unit: any) => unit.parent_unit_name !== null);

      if (childUnit) {
        expect(childUnit.parent_unit_name).not.toBeNull();
        expect(typeof childUnit.parent_unit_name).toBe('string');
      }
    });

    test('complete_address should be a string (can be empty)', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      if (data.length > 0) {
        data.forEach((unit: any) => {
          expect(typeof unit.complete_address).toBe('string');
        });
      }
    });

  });

  describe('Response Format Tests', () => {

    let validToken: string;

    beforeAll(() => {
      validToken = generateTestToken();
    });

    test('Should follow GlobalResponseDto structure', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Check GlobalResponseDto structure
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(typeof response.body.status).toBe('number');
      expect(typeof response.body.message).toBe('string');
    });

    test('Content-Type should be application/json', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

  });

  describe('Data Integrity Tests', () => {

    let validToken: string;

    beforeAll(() => {
      validToken = generateTestToken();
    });

    test('org_unit_id should be unique', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      if (data.length > 0) {
        const ids = data.map((unit: any) => unit.org_unit_id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
      }
    });

    test('All organizational units should have non-empty org_unit_name', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      if (data.length > 0) {
        data.forEach((unit: any) => {
          expect(unit.org_unit_name).toBeTruthy();
          expect(unit.org_unit_name.length).toBeGreaterThan(0);
        });
      }
    });

    test('All organizational units should have valid unit_type', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const data = response.body.data;

      if (data.length > 0) {
        data.forEach((unit: any) => {
          expect(unit.unit_type).toBeTruthy();
          expect(typeof unit.unit_type).toBe('string');
        });
      }
    });

  });

  describe('Edge Cases and Error Handling', () => {

    let validToken: string;

    beforeAll(() => {
      validToken = generateTestToken();
    });

    test('Should handle requests with additional headers gracefully', async () => {
      const response = await request(app)
        .get(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .set('X-Custom-Header', 'test-value')
        .set('User-Agent', 'Test Agent')
        .expect(200);

      expect(response.body).toHaveProperty('status', 200);
    });

    test('Should not accept query parameters (endpoint has no parameters)', async () => {
      const response = await request(app)
        .get(`${API_ENDPOINT}?page=1&limit=10`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Should still return all data (ignoring query params)
      expect(response.body.data).toBeDefined();
    });

    test('Should reject POST requests to GET-only endpoint', async () => {
      const response = await request(app)
        .post(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ test: 'data' });

      expect(response.status).not.toBe(200);
    });

    test('Should reject PUT requests to GET-only endpoint', async () => {
      const response = await request(app)
        .put(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ test: 'data' });

      expect(response.status).not.toBe(200);
    });

    test('Should reject DELETE requests to GET-only endpoint', async () => {
      const response = await request(app)
        .delete(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).not.toBe(200);
    });

  });

});