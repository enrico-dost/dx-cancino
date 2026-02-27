import { injectable, inject } from "inversify";
import type { UnitTypeRepository } from "../../repositories/unit-type/unitTypeRepository";
import type { UnitTypeEntity } from "../../entities/unit-type/unitTypeEntity";
import { TYPES } from "../../../di/types";

@injectable()
export class EditUnitTypeUseCase {
  constructor(@inject(TYPES.UnitTypeRepository) private unitTypeRepository: UnitTypeRepository) { }

  async execute(unitTypeId: number, data: Partial<UnitTypeEntity>): Promise<UnitTypeEntity | null> {
    return await this.unitTypeRepository.update(unitTypeId, data);
  }
}