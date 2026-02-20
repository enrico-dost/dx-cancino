import type { UnitTypeModel } from "../../models/unit-type/unitTypeModel";
import type { UnitTypeEntity } from "../../../domain/entities/unit-type/unitTypeEntity";

export class UnitTypeMapper {
  static toEntity(model: UnitTypeModel): UnitTypeEntity {
    return {
      unit_type_id: model.unit_type_id,
      unit_type_name: model.unit_type_name,
      unit_type_descr: model.unit_type_descr,
      is_active: model.is_active,
    };
  }

  static toEntities(models: UnitTypeModel[]): UnitTypeEntity[] {
    return models.map(this.toEntity);
  }
}
