import 'reflect-metadata';
import { Container } from 'inversify';
import { Pool } from 'pg';
import { TYPES } from './types';

// Database
import { databaseService } from '../data/data-sources/databaseService';

// Agency API
import { agencyRepositoryImp } from '../data/repositories-imp/agency-by-sector/agencyRepositoryImp';
import { getAgencyBySectorUseCase } from '../domain/use-cases/agency-by-sector/getAgencyBySectorUseCase';
import { agencyController } from '../presentation/controllers/agency-by-sector/agencyController';

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

// Unit Type API
import { UnitTypeRepositoryImp } from '../data/repositories-imp/unit-type/unitTypeRepositoryImp';
import { GetAllUnitTypesUseCase } from '../domain/use-cases/unit-type/getAllUnitTypesUseCase';
import { UnitTypeController } from '../presentation/controllers/unit-type/unitTypeController';

// Edit Unit Type API
import { UnitTypeRepository } from "../domain/repositories/unit-type/unitTypeRepository";
import { EditUnitTypeUseCase } from '../domain/use-cases/unit-type/editUnitTypeUseCase';
import { EditUnitTypeController } from '../presentation/controllers/unit-type/editUnitTypeController';

// User Organizational Unit Access
import { UserOrgUnitAccessRepositoryImp } from "../data/repositories-imp/user-org-unit-access/userOrgUnitAccessRepositoryImp";
import { UpsertUserOrgUnitAccessUseCase } from "../domain/use-cases/user-org-unit-access/upsertUserOrgUnitAccessUseCase";
import { GetUserOrgUnitAccessByUserUseCase } from "../domain/use-cases/user-org-unit-access/getUserOrgUnitAccessByUserUseCase";
import { UserOrgUnitAccessController } from "../presentation/controllers/user-org-unit-access/userOrgUnitAccessController";

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
//  Unit Type API Module
// ============================================
container.bind(TYPES.UnitTypeRepository).to(UnitTypeRepositoryImp).inSingletonScope();
container.bind(TYPES.GetAllUnitTypesUseCase).to(GetAllUnitTypesUseCase).inSingletonScope();
container.bind(TYPES.UnitTypeController).to(UnitTypeController).inSingletonScope();

// ============================================
//  User Organizational Unit Access API Module
// ============================================
container.bind(TYPES.UserOrgUnitAccessRepository).to(UserOrgUnitAccessRepositoryImp).inSingletonScope();
container.bind(TYPES.UpsertUserOrgUnitAccessUseCase).to(UpsertUserOrgUnitAccessUseCase).inSingletonScope();
container.bind(TYPES.GetUserOrgUnitAccessByUserUseCase).to(GetUserOrgUnitAccessByUserUseCase).inSingletonScope();
container.bind(TYPES.UserOrgUnitAccessController).to(UserOrgUnitAccessController).inSingletonScope();

// ============================================
//  Edit Unit Type API Module
// ============================================
container.bind<EditUnitTypeUseCase>(TYPES.EditUnitTypeUseCase).to(EditUnitTypeUseCase);
container.bind<EditUnitTypeController>(TYPES.EditUnitTypeController).to(EditUnitTypeController);

// ============================================
// Auth Module - Shared across all APIs
// ============================================
container.bind(TYPES.authController)
  .to(authController)
  .inSingletonScope();

export { container };
