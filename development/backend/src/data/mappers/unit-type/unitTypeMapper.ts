import type { UnitTypeModel } from "../../models/unit-type/unitTypeModel";
import type { UnitTypeEntity } from "../../../domain/entities/unit-type/unitTypeEntity";

export class UnitTypeMapper {
  static toEntity(model: UnitTypeModel): UnitTypeEntity {
    return {
      unit_type_id: model.unit_type_id,
      unit_type_name: model.unit_type_name,
      unit_type_descr: model.unit_type_descr,
      is_active: model.is_active,
      updated_at: model.updated_at
    };
  }

  static toEntities(models: UnitTypeModel[]): UnitTypeEntity[] {
    return models.map(model => this.toEntity(model));
  }
}
