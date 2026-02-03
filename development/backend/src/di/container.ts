import 'reflect-metadata';
import { Container } from 'inversify';
import { Pool } from 'pg';
import { TYPES } from './types';

// Database
import { DatabaseService } from '../data/data-sources/DatabaseService';

// Agency API
import { AgencyRepositoryImp } from '../data/repositories-imp/agency/AgencyRepositoryImp';
import { GetAgencyBySectorUseCase } from '../domain/use-cases/agency/GetAgencyBySectorUseCase';
import { AgencyController } from '../presentation/controllers/agency/AgencyController';

// Organization API
import { OrganizationalUnitRepositoryImp } from '../data/repositories-imp/organizational-unit-list/organizationalUnitRepositoryImp';
import type { OrganizationalUnitRepository } from '../domain/repositories/organizational-unit-list/organizationalUnitRepository';
import { GetAllOrganizationalUnitsUseCase } from '../domain/use-cases/organizational-unit-list/getOrganizationalUnitUseCase';
import { OrganizationalUnitController } from '../presentation/controllers/organizational-unit-list/organizationalunitController';

// Auth
import { AuthController } from '../presentation/controllers/auth/AuthController';

/**
 * Dependency Injection Container
 * Centralized IoC container for all API modules
 * Scalable architecture for adding new APIs
 */
const container = new Container();

// ============================================
// Database Layer - Shared across all APIs
// ============================================
container.bind<DatabaseService>(TYPES.DatabaseService)
  .to(DatabaseService)
  .inSingletonScope();

container.bind<Pool>(TYPES.DatabasePool)
  .toDynamicValue((context) => {
    const dbService = container.get<DatabaseService>(TYPES.DatabaseService);
    return dbService.getPool();
  })
  .inSingletonScope();

// ============================================
// Agency API Module
// ============================================
container.bind(TYPES.AgencyRepository)
  .to(AgencyRepositoryImp)
  .inSingletonScope();

container.bind(TYPES.GetAgencyBySectorUseCase)
  .to(GetAgencyBySectorUseCase)
  .inSingletonScope();

container.bind(TYPES.AgencyController)
  .to(AgencyController)
  .inSingletonScope();

// ============================================
// Organization API Module
// ============================================
container.bind<OrganizationalUnitRepository>(TYPES.OrganizationalUnitRepository)
  .to(OrganizationalUnitRepositoryImp)
  .inSingletonScope();

container.bind<GetAllOrganizationalUnitsUseCase>(TYPES.GetAllOrganizationalUnitsUseCase)
  .to(GetAllOrganizationalUnitsUseCase)
  .inSingletonScope();

container.bind<OrganizationalUnitController>(TYPES.OrganizationalUnitController)
  .to(OrganizationalUnitController)
  .inSingletonScope();

// ============================================
// Auth Module - Shared across all APIs
// ============================================
container.bind(TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();

export { container };
