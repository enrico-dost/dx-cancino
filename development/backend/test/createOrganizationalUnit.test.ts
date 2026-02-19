/**
 * Organizational Unit Creation API Tests
 * Tests for POST /api/organizational-units endpoint
 * * Based on User Story 429: Create New Organizational Unit API
 */

import request from 'supertest';
import { app, initializeRoutes } from "../src/index";
import jwt from 'jsonwebtoken';

const API_ENDPOINT = '/api/organizational-units';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Helper to generate a valid admin token as required by the user story
function generateAdminToken(): string {
  return jwt.sign(
    { userId: 1, role: 'admin', email: 'admin@dost.gov.ph' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

beforeAll(async () => {
  await initializeRoutes();
});

describe('Organizational Unit Creation API', () => {
  let validToken: string;

  beforeAll(() => {
    validToken = generateAdminToken();
  });

  describe('Scenario: Successful Creation', () => {
    test('Should return 201 and the new unit details when valid data is provided', async () => {
      const payload = {
        org_unit_name: 'DOST Regional Office VI',
        org_unit_descr: 'DOST Western Visayas Office',
        unit_type_id: 11,
        parent_org_unit_id: 109,
        region_id: 9,
        prov_id: 44,
        city_id: 477,
        brgy_id: 1,
        address: 'Magsaysay Village',
        latitude: '10.6974',
        longitude: '122.5645'
      };

      const response = await request(app)
        .post(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .set('Accept', 'application/json')
        .type('form') // application/x-www-form-urlencoded as per requirements
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Organizational unit created successfully.');
      expect(response.body.data).toHaveProperty('org_unit_id');
      expect(response.body.data.org_unit_name).toBe(payload.org_unit_name);
    });
  });

  describe('Scenario: Unauthorized Access', () => {
    test('Should return 401 when no JWT is provided', async () => {
      const response = await request(app)
        .post(API_ENDPOINT)
        .type('form')
        .send({ org_unit_name: 'Unauthorized Unit' });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/unauthorized/i);
    });

    test('Should return 401 when an invalid JWT is provided', async () => {
      const response = await request(app)
        .post(API_ENDPOINT)
        .set('Authorization', 'Bearer invalid.token.payload')
        .type('form')
        .send({ org_unit_name: 'Invalid Token Test' });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid token/i);
    });
  });

  describe('Scenario: Invalid Input Data', () => {
    test('Should return 400 when required fields are missing', async () => {
      // Sending payload without required region_id or unit_type_id
      const incompletePayload = {
        org_unit_name: 'Incomplete Unit'
      };

      const response = await request(app)
        .post(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .type('form')
        .send(incompletePayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed.');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    test('Should return 400 for invalid ID types (e.g., non-existent parent_org_unit_id)', async () => {
      const invalidDataPayload = {
        org_unit_name: 'Invalid ID Unit',
        unit_type_id: 9999, // Assuming this ID doesn't exist
        region_id: 9
      };

      const response = await request(app)
        .post(API_ENDPOINT)
        .set('Authorization', `Bearer ${validToken}`)
        .type('form')
        .send(invalidDataPayload);

      expect(response.status).toBe(400);
    });
  });
});