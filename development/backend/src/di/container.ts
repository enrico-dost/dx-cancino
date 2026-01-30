import { Container } from 'inversify';
import { TYPES } from './types';
import { AgencyRepositoryImp } from '../data/repositories-imp/agency/AgencyRepositoryImp';
import { GetAgencyBySectorUseCase } from '../domain/use-cases/agency/GetAgencyBySectorUseCase';
import { AgencyController } from '../presentation/controllers/agency/AgencyController';
import { DatabaseService, PostgresDatabaseService } from '../data/data-sources/DatabaseService';
import { AuthController } from '../presentation/controllers/auth/AuthController';

const container = new Container();

// Database Service
container.bind(TYPES.DatabaseService).toDynamicValue(() => {
  return new PostgresDatabaseService(process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database');
}).inSingletonScope();

// Repository
container.bind(TYPES.AgencyRepository).to(AgencyRepositoryImp).inSingletonScope();

// Use Cases
container.bind(TYPES.GetAgencyBySectorUseCase).to(GetAgencyBySectorUseCase).inSingletonScope();

// Controllers
container.bind(TYPES.AgencyController).to(AgencyController).inSingletonScope();
container.bind(TYPES.AuthController).to(AuthController).inSingletonScope();

export { container };
