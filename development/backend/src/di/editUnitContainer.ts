import 'reflect-metadata';
import { container } from './container'; 
import { TYPES } from './editUnitTypes';

// Repositories
import { UnitRepository } from '../data/repositories-imp/edit-unit/unitRepository';
import { UnitMemberRepository } from '../data/repositories-imp/edit-unit/unitMemberRepository';

// Use Case & Controller
import { UpdateUnitUseCase } from '../domain/use-cases/edit-unit/updateUnitUseCase';
import { UnitController } from '../presentation/controllers/edit-unit/unitController';

// Interfaces
import { IUnitRepository } from '../domain/repositories/edit-unit/iUnitRepository';
import { IUnitMemberRepository } from '../domain/repositories/edit-unit/iUnitMemberRepository';

// bindings
container.bind<IUnitRepository>(TYPES.UnitRepository).to(UnitRepository);
container.bind<IUnitMemberRepository>(TYPES.UnitMemberRepository).to(UnitMemberRepository);
container.bind<UpdateUnitUseCase>(TYPES.UpdateUnitUseCase).to(UpdateUnitUseCase);
container.bind<UnitController>(TYPES.UnitController).to(UnitController);

export { container };

