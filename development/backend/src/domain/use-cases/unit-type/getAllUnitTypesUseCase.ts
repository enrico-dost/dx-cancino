import { injectable, inject } from "inversify";
import type { UnitTypeRepository } from "../../repositories/unit-type/unitTypeRepository";
import type { UnitTypeEntity } from "../../entities/unit-type/unitTypeEntity";
import { TYPES } from "../../../di/types";

@injectable()
export class GetAllUnitTypesUseCase {
  constructor(
    @inject(TYPES.UnitTypeRepository)
    private unitTypeRepository: UnitTypeRepository
  ) {}

  async execute(): Promise<UnitTypeEntity[]> {
    return this.unitTypeRepository.getAllUnitTypes();
  }
}
