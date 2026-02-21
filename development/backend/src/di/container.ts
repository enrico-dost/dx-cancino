import 'reflect-metadata';
import { Container } from 'inversify';
import { Pool } from 'pg';
import { TYPES } from './types';

// Database
import { databaseService } from '../data/data-sources/databaseService';

// Agency API
import { agencyRepositoryImp } from '../data/repositories-imp/agency/agencyRepositoryImp';
import { getAgencyBySectorUseCase } from '../domain/use-cases/agency/getAgencyBySectorUseCase';
import { agencyController } from '../presentation/controllers/agency/agencyController';

// Organization List API
import { organizationalUnitRepositoryImp as OrgListRepositoryImp } from '../data/repositories-imp/organizational-unit-list/organizationalUnitRepositoryImp';
import type { OrganizationalUnitRepository } from '../domain/repositories/organizational-unit-list/organizationalUnitRepository';
import { getAllOrganizationalUnitsUseCase } from '../domain/use-cases/organizational-unit-list/getOrganizationalUnitUseCase';
import { organizationalUnitController as OrgListController } from '../presentation/controllers/organizational-unit-list/organizationalunitController';
import type { organizationalUnitController } from '../presentation/controllers/organizational-unit-list/organizationalunitController';

// Update Organizational Unit API
import { organizationalUnitRepositoryImp as UpdateOrgRepositoryImp } from '../data/repositories-imp/update-organizational-unit/organizationalUnitRepositoryImp';
import { updateOrganizationalUnitUseCase } from '../domain/use-cases/update-organizational-unit/updateOrganizationalUnitUseCase';
import { organizationalUnitController as UpdateOrgController } from '../presentation/controllers/update-organizational-unit/organizationalUnitController';

// Auth
import { authController } from '../presentation/controllers/auth/authController';

/**
 * Dependency Injection Container
 * Centralized IoC container for all API modules
 * Scalable architecture for adding new APIs
 */
const container = new Container();

// ============================================
// Database Layer - Shared across all APIs
// ============================================
container.bind<databaseService>(TYPES.databaseService)
  .to(databaseService)
  .inSingletonScope();

container.bind<Pool>(TYPES.DatabasePool)
  .toDynamicValue((context) => {
    const dbService = container.get<databaseService>(TYPES.databaseService);
    return dbService.getPool();
  })
  .inSingletonScope();

// ============================================
// Agency API Module
// ============================================
container.bind(TYPES.AgencyRepository)
  .to(agencyRepositoryImp)
  .inSingletonScope();

container.bind(TYPES.getAgencyBySectorUseCase)
  .to(getAgencyBySectorUseCase)
  .inSingletonScope();

container.bind(TYPES.agencyController)
  .to(agencyController)
  .inSingletonScope();

// ============================================
// Organization List API Module
// ============================================
container.bind<OrganizationalUnitRepository>(TYPES.OrganizationalUnitRepository)
  .to(OrgListRepositoryImp)
  .inSingletonScope();

container.bind<getAllOrganizationalUnitsUseCase>(TYPES.getAllOrganizationalUnitsUseCase)
  .to(getAllOrganizationalUnitsUseCase)
  .inSingletonScope();

container.bind<organizationalUnitController>(TYPES.organizationalUnitController)
  .to(OrgListController)
  .inSingletonScope();

// ============================================
// Update Organizational Unit API Module
// ============================================
container.bind(TYPES.UpdateOrganizationalUnitRepository)
  .to(UpdateOrgRepositoryImp)
  .inSingletonScope();

container.bind(TYPES.updateOrganizationalUnitUseCase)
  .to(updateOrganizationalUnitUseCase)
  .inSingletonScope();

container.bind(TYPES.UpdateOrganizationalUnitController)
  .to(UpdateOrgController)
  .inSingletonScope();

// ============================================
// Auth Module - Shared across all APIs
// ============================================
container.bind(TYPES.authController)
  .to(authController)
  .inSingletonScope();

export { container };
