import { Container } from 'inversify';
import { TYPES } from './types';
import { AgencyRepositoryImp } from '../data/repositories-imp/agency/AgencyRepositoryImp';
import { GetAgencyBySectorUseCase } from '../domain/use-cases/agency/GetAgencyBySectorUseCase';
import { AgencyController } from '../presentation/controllers/agency/AgencyController';
import { DatabaseService, PostgresDatabaseService } from '../data/data-sources/DatabaseService';
import { AuthController } from '../presentation/controllers/auth/AuthController';
import { OrganizationalUnitRepositoryImp } from '../data/repositories-imp/update-organizational-unit/OrganizationalUnitRepositoryImp';
import { UpdateOrganizationalUnitUseCase } from '../domain/use-cases/update-organizational-unit/updateOrganizationalUnitUseCase';
import { OrganizationalUnitController } from '../presentation/controllers/update-organizational-unit/organizationalUnitController';

const container = new Container();

// Database Service
container.bind(TYPES.DatabaseService).toDynamicValue(() => {
  return new PostgresDatabaseService(process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database');
}).inSingletonScope();

// Repository
container.bind(TYPES.AgencyRepository).to(AgencyRepositoryImp).inSingletonScope();
container.bind(TYPES.OrganizationalUnitRepository).to(OrganizationalUnitRepositoryImp).inSingletonScope();

// Use Cases
container.bind(TYPES.GetAgencyBySectorUseCase).to(GetAgencyBySectorUseCase).inSingletonScope();
container.bind(TYPES.UpdateOrganizationalUnitUseCase).to(UpdateOrganizationalUnitUseCase).inSingletonScope();

// Controllers
container.bind(TYPES.AgencyController).to(AgencyController).inSingletonScope();
container.bind(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind(TYPES.OrganizationalUnitController).to(OrganizationalUnitController).inSingletonScope();

export { container };
