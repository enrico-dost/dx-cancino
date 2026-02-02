import 'reflect-metadata';
import { Container } from 'inversify';
import { Pool } from 'pg';
import { TYPES } from './types';

// Database
import { DatabaseService } from '../data/data-sources/DatabaseService';

// Organizational Unit
import { OrganizationalUnitRepositoryImp } from '../data/repositories-imp/organizationalunitlist/OrganizationalUnitRepositoryImp';
import type { OrganizationalUnitRepository } from '../domain/repositories/organizationalunitlist/OrganizationalUnitRepository';
import { GetAllOrganizationalUnitsUseCase } from '../domain/use-cases/organizationalunitlist/getOrganizationalUnitUseCase';
import { OrganizationalUnitController } from '../presentation/controllers/organization/OrganizationalUnitController';

// Create container
const container = new Container();

// Bind Database
container.bind<DatabaseService>(TYPES.DatabaseService)
  .to(DatabaseService)
  .inSingletonScope();

container.bind<Pool>(TYPES.DatabasePool)
  .toDynamicValue((context) => {
    const dbService = container.get<DatabaseService>(TYPES.DatabaseService);
    return dbService.getPool();
  })
  .inSingletonScope();

// Bind Organizational Unit dependencies
container.bind<OrganizationalUnitRepository>(TYPES.OrganizationalUnitRepository)
  .to(OrganizationalUnitRepositoryImp)
  .inSingletonScope();

container.bind<GetAllOrganizationalUnitsUseCase>(TYPES.GetAllOrganizationalUnitsUseCase)
  .to(GetAllOrganizationalUnitsUseCase)
  .inSingletonScope();

container.bind<OrganizationalUnitController>(TYPES.OrganizationalUnitController)
  .to(OrganizationalUnitController)
  .inSingletonScope();

export { container };