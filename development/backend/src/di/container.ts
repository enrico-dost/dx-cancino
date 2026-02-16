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

// Organization List API
import { OrganizationalUnitRepositoryImp as OrgListRepositoryImp } from '../data/repositories-imp/organizational-unit-list/organizationalUnitRepositoryImp';
import type { OrganizationalUnitRepository } from '../domain/repositories/organizational-unit-list/organizationalUnitRepository';
import { GetAllOrganizationalUnitsUseCase } from '../domain/use-cases/organizational-unit-list/getOrganizationalUnitUseCase';
import { OrganizationalUnitController as OrgListController } from '../presentation/controllers/organizational-unit-list/organizationalunitController';
import type { OrganizationalUnitController } from '../presentation/controllers/organizational-unit-list/organizationalunitController';

// Update Organizational Unit API
import { OrganizationalUnitRepositoryImp as UpdateOrgRepositoryImp } from '../data/repositories-imp/update-organizational-unit/OrganizationalUnitRepositoryImp';
import { UpdateOrganizationalUnitUseCase } from '../domain/use-cases/update-organizational-unit/updateOrganizationalUnitUseCase';
import { OrganizationalUnitController as UpdateOrgController } from '../presentation/controllers/update-organizational-unit/organizationalUnitController';

// Unit Type API
import { UnitTypeRepositoryImp } from '../data/repositories-imp/unit-type/unitTypeRepositoryImp';
import { GetAllUnitTypesUseCase } from '../domain/use-cases/unit-type/getAllUnitTypesUseCase';
import { UnitTypeController } from '../presentation/controllers/unit-type/unitTypeController';

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
// Organization List API Module
// ============================================
container.bind<OrganizationalUnitRepository>(TYPES.OrganizationalUnitRepository)
  .to(OrgListRepositoryImp)
  .inSingletonScope();

container.bind<GetAllOrganizationalUnitsUseCase>(TYPES.GetAllOrganizationalUnitsUseCase)
  .to(GetAllOrganizationalUnitsUseCase)
  .inSingletonScope();

container.bind<OrganizationalUnitController>(TYPES.OrganizationalUnitController)
  .to(OrgListController)
  .inSingletonScope();

// ============================================
// Update Organizational Unit API Module
// ============================================
container.bind(TYPES.UpdateOrganizationalUnitRepository)
  .to(UpdateOrgRepositoryImp)
  .inSingletonScope();

container.bind(TYPES.UpdateOrganizationalUnitUseCase)
  .to(UpdateOrganizationalUnitUseCase)
  .inSingletonScope();

container.bind(TYPES.UpdateOrganizationalUnitController)
  .to(UpdateOrgController)
  .inSingletonScope();


// ============================================
//  Unit Type API Module
// ============================================
container.bind(TYPES.UnitTypeRepository).to(UnitTypeRepositoryImp).inSingletonScope();
container.bind(TYPES.GetAllUnitTypesUseCase).to(GetAllUnitTypesUseCase).inSingletonScope();
container.bind(TYPES.UnitTypeController).to(UnitTypeController).inSingletonScope();

// ============================================
// Auth Module - Shared across all APIs
// ============================================
container.bind(TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();

export { container };
