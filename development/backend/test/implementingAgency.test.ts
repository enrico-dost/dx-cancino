import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createImplementingAgencyRoutes } from '../src/presentation/routes/implementing-agency/implementingAgencyRoutes';
import { implementingAgencyController } from '../src/presentation/controllers/implementing-agency/implementingAgencyController';
import type { ImplementingAgencyEntity } from '../src/domain/entities/implementing-agency/implementingAgencyEntity';

const API_ENDPOINT = '/api/implementing-agency/unit-type';
const JWT_SECRET = 'test-secret';

process.env.JWT_SECRET = JWT_SECRET;

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

describe('Implementing Agency List API - GET /api/implementing-agency/unit-type', () => {
    const mockAgencies: ImplementingAgencyEntity[] = [
        { org_unit_id: 102, org_unit_name: 'PCAARRD' },
        { org_unit_id: 103, org_unit_name: 'PCHRD' },
        { org_unit_id: 104, org_unit_name: 'PCIEERD' },
        { org_unit_id: 139, org_unit_name: 'ASTI' },
        { org_unit_id: 140, org_unit_name: 'FNRI' }
    ];

    const mockRegionalOffices: ImplementingAgencyEntity[] = [
        { org_unit_id: 201, org_unit_name: 'Regional Office 1' },
        { org_unit_id: 202, org_unit_name: 'Regional Office 2' }
    ];

    const mockUseCase = {
        execute: jest.fn() as jest.MockedFunction<(unitTypeIds: number[]) => Promise<ImplementingAgencyEntity[]>>
    };

    let app: express.Express;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        const controller = new implementingAgencyController(mockUseCase as any);
        app.use('/api/implementing-agency', createImplementingAgencyRoutes(controller));
    });

    describe('Scenario: Successful Data Retrieval with Default Filter', () => {
        it('should retrieve agencies by default filter (unit_types=1)', async () => {
            mockUseCase.execute.mockResolvedValue(mockAgencies);

            const response = await request(app)
                .get(API_ENDPOINT)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.message).toBe('Successfully retrieved implementing agencies.');
            expect(response.body.data).toEqual(expect.arrayContaining([
                expect.objectContaining({ org_unit_name: expect.any(String), org_unit_id: expect.any(Number) })
            ]));
            expect(response.body.data.some((unit: ImplementingAgencyEntity) => unit.org_unit_name === 'PCAARRD')).toBeTruthy();
        });
    });

    describe('Scenario: Successful Data Retrieval with Explicit Single Filter', () => {
        it('should retrieve regional offices when unit_types=2 is specified', async () => {
            mockUseCase.execute.mockResolvedValue(mockRegionalOffices);

            const response = await request(app)
                .get(`${API_ENDPOINT}?unit_types=2`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.message).toBe('Successfully retrieved implementing agencies.');
            expect(response.body.data).toEqual(expect.arrayContaining([
                expect.objectContaining({ org_unit_name: expect.any(String), org_unit_id: expect.any(Number) })
            ]));
            expect(response.body.data.some((unit: ImplementingAgencyEntity) => unit.org_unit_name.includes('Regional Office'))).toBeTruthy();
        });
    });

    describe('Scenario: Successful Data Retrieval with Multiple Filters', () => {
        it('should retrieve agencies and regional offices when unit_types=1,2 is specified', async () => {
            const combined = [...mockAgencies, ...mockRegionalOffices];
            mockUseCase.execute.mockResolvedValue(combined);

            const response = await request(app)
                .get(`${API_ENDPOINT}?unit_types=1,2`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.message).toBe('Successfully retrieved implementing agencies.');
            expect(response.body.data).toEqual(expect.arrayContaining([
                expect.objectContaining({ org_unit_name: expect.any(String), org_unit_id: expect.any(Number) })
            ]));

            const hasAgency = response.body.data.some((unit: ImplementingAgencyEntity) => unit.org_unit_name === 'PCAARRD');
            const hasRegionalOffice = response.body.data.some((unit: ImplementingAgencyEntity) => unit.org_unit_name.includes('Regional Office'));
            expect(hasAgency).toBeTruthy();
            expect(hasRegionalOffice).toBeTruthy();
        });
    });

    describe('Scenario: Unauthorized Access', () => {
        it('should return 401 Unauthorized when no valid JWT is provided', async () => {
            const response = await request(app)
                .get(API_ENDPOINT)
                .expect(401);

            expect(response.body.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should return 401 Unauthorized with invalid JWT token', async () => {
            const response = await request(app)
                .get(API_ENDPOINT)
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });

    describe('Scenario: Empty Data Set', () => {
        it('should return an empty array when no records match the filter', async () => {
            mockUseCase.execute.mockResolvedValue([]);

            const response = await request(app)
                .get(`${API_ENDPOINT}?unit_types=999`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.message).toBe('No implementing agencies found.');
            expect(response.body.data).toEqual([]);
        });
    });

    describe('Scenario: Invalid Query Parameter', () => {
        it('should return 400 for invalid unit_types', async () => {
            const response = await request(app)
                .get(`${API_ENDPOINT}?unit_types=abc`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.message).toBe(
                'Invalid unit_types parameter. Must be comma-separated integers.'
            );
            expect(response.body.data).toEqual({});
        });

        it('should return 400 when unit_types contains mixed valid and invalid values', async () => {
            const response = await request(app)
                .get(`${API_ENDPOINT}?unit_types=1,abc,2`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.message).toBe(
                'Invalid unit_types parameter. Must be comma-separated integers.'
            );
        });
    });

    describe('Query Parameter Parsing', () => {
        it('should parse comma-separated unit_types values correctly', async () => {
            mockUseCase.execute.mockResolvedValue(mockAgencies);

            await request(app)
                .get(`${API_ENDPOINT}?unit_types=1,2,15`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(mockUseCase.execute).toHaveBeenCalledWith([1, 2, 15]);
        });

        it('should use default [1] when no unit_types is provided', async () => {
            mockUseCase.execute.mockResolvedValue(mockAgencies);

            await request(app)
                .get(API_ENDPOINT)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(mockUseCase.execute).toHaveBeenCalledWith([]);
        });

        it('should handle single unit_types value', async () => {
            mockUseCase.execute.mockResolvedValue(mockRegionalOffices);

            await request(app)
                .get(`${API_ENDPOINT}?unit_types=2`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(mockUseCase.execute).toHaveBeenCalledWith([2]);
        });

        it('should handle spaces in comma-separated values', async () => {
            mockUseCase.execute.mockResolvedValue(mockAgencies);

            await request(app)
                .get(`${API_ENDPOINT}?unit_types=1, 2, 15`)
                .set('Authorization', `Bearer ${generateTestToken()}`)
                .expect(200);

            expect(mockUseCase.execute).toHaveBeenCalledWith([1, 2, 15]);
        });
    });
});
