import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createAgencyRoutes } from '../src/presentation/routes/agency-by-sector/agencyRoutes';
import { agencyController } from '../src/presentation/controllers/agency-by-sector/AgencyController';
import type { AgencyEntity } from '../src/domain/entities/agency-by-sector/AgencyEntity';

const API_ENDPOINT = '/api/agencies/by-sector/list';
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

describe('Agency By Sector API - GET /api/agencies/by-sector/list', () => {
  const mockUseCase = {
    execute: jest.fn() as jest.MockedFunction<() => Promise<AgencyEntity[]>>
  };

  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    const controller = new agencyController(mockUseCase as any);
    app.use('/api/agencies', createAgencyRoutes(controller));
  });

  it('should return 401 when no Authorization header is provided', async () => {
    const response = await request(app)
      .get(API_ENDPOINT)
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      message: 'Unauthorized',
      data: {}
    });
  });

  it('should return 401 when JWT is invalid', async () => {
    const response = await request(app)
      .get(API_ENDPOINT)
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      message: 'Unauthorized',
      data: {}
    });
  });

  it('should return 200 and grouped sectors with only org_unit_id, org_unit_name, and parent_org_unit_id', async () => {
    const token = generateTestToken();

    mockUseCase.execute.mockResolvedValue([
      { org_unit_id: 201, org_unit_name: 'PCAARRD', parent_org_unit_id: 101, sector_name: 'Sectoral Planning Councils' },
      { org_unit_id: 202, org_unit_name: 'PCHRD', parent_org_unit_id: 101, sector_name: 'Sectoral Planning Councils' },
      { org_unit_id: 203, org_unit_name: 'PCIEERD', parent_org_unit_id: 101, sector_name: 'Sectoral Planning Councils' },
      { org_unit_id: 301, org_unit_name: 'ASTI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 302, org_unit_name: 'FNRI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 303, org_unit_name: 'FPRDI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 304, org_unit_name: 'ITDI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 305, org_unit_name: 'MIRDC', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 306, org_unit_name: 'PNRI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 307, org_unit_name: 'PTRI', parent_org_unit_id: 153, sector_name: 'Research And Development Institutes' },
      { org_unit_id: 401, org_unit_name: 'PAGASA', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 402, org_unit_name: 'PHIVOLCS', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 403, org_unit_name: 'SEI', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 404, org_unit_name: 'PSHS', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 405, org_unit_name: 'STII', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 406, org_unit_name: 'TAPI', parent_org_unit_id: 155, sector_name: 'S&T Service Institutes' },
      { org_unit_id: 501, org_unit_name: 'NAST', parent_org_unit_id: 157, sector_name: 'Advisory Body' },
      { org_unit_id: 502, org_unit_name: 'NRCP', parent_org_unit_id: 157, sector_name: 'Advisory Body' }
    ]);

    const response = await request(app)
      .get(API_ENDPOINT)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe('Agency dropdown list retrieved successfully.');
    expect(Array.isArray(response.body.data)).toBe(true);

    const sectors = response.body.data;
    const sectoralPlanning = sectors.find((s: any) => s.org_unit_id === 101);
    const rdInstitutes = sectors.find((s: any) => s.org_unit_id === 153);
    const stServices = sectors.find((s: any) => s.org_unit_id === 155);
    const advisoryBody = sectors.find((s: any) => s.org_unit_id === 157);

    expect(sectoralPlanning).toBeTruthy();
    expect(rdInstitutes).toBeTruthy();
    expect(stServices).toBeTruthy();
    expect(advisoryBody).toBeTruthy();

    const firstAgency = sectoralPlanning.agencies[0];
    expect(firstAgency).toHaveProperty('org_unit_id');
    expect(firstAgency).toHaveProperty('org_unit_name');
    expect(firstAgency).toHaveProperty('parent_org_unit_id');
    expect(Object.keys(firstAgency).sort()).toEqual([
      'org_unit_id',
      'org_unit_name',
      'parent_org_unit_id'
    ]);

    expect(sectoralPlanning.agencies.map((x: any) => x.org_unit_name).sort()).toEqual([
      'PCAARRD',
      'PCHRD',
      'PCIEERD'
    ]);

    expect(rdInstitutes.agencies.map((x: any) => x.org_unit_name).sort()).toEqual([
      'ASTI',
      'FNRI',
      'FPRDI',
      'ITDI',
      'MIRDC',
      'PNRI',
      'PTRI'
    ]);

    expect(stServices.agencies.map((x: any) => x.org_unit_name).sort()).toEqual([
      'PAGASA',
      'PHIVOLCS',
      'PSHS',
      'SEI',
      'STII',
      'TAPI'
    ]);

    expect(advisoryBody.agencies.map((x: any) => x.org_unit_name).sort()).toEqual([
      'NAST',
      'NRCP'
    ]);
  });

  it('should return 200 and empty array data when no qualifying agencies are found', async () => {
    const token = generateTestToken();
    mockUseCase.execute.mockResolvedValue([]);

    const response = await request(app)
      .get(API_ENDPOINT)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      message: 'No agencies found.',
      data: []
    });
  });
});
