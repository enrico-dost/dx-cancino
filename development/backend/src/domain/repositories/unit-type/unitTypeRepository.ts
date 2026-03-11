import type { UnitTypeEntity } from "../../entities/unit-type/unitTypeEntity";

export interface UnitTypeRepository {
  getAllUnitTypes(): Promise<UnitTypeEntity[]>;

  update(unitTypeId: number, data: Partial<UnitTypeEntity>): Promise<UnitTypeEntity | null>;
}
