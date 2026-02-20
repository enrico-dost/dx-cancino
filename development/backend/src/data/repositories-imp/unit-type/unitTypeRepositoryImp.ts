import { injectable, inject } from "inversify";
import type { Pool } from "pg";
import type { UnitTypeRepository } from "../../../domain/repositories/unit-type/unitTypeRepository";
import type { UnitTypeEntity } from "../../../domain/entities/unit-type/unitTypeEntity";
import type { UnitTypeModel } from "../../models/unit-type/unitTypeModel";
import { UnitTypeMapper } from "../../mappers/unit-type/unitTypeMapper";
import { TYPES } from "../../../di/types";

@injectable()
export class UnitTypeRepositoryImp implements UnitTypeRepository {
  constructor(@inject(TYPES.DatabasePool) private pool: Pool) {}

  async getAllUnitTypes(): Promise<UnitTypeEntity[]> {
    const query = `
      SELECT unit_type_id, unit_type_name, unit_type_descr, is_active
      FROM tblunit_types
      ORDER BY unit_type_id;
    `;

    const result = await this.pool.query<UnitTypeModel>(query);

    return UnitTypeMapper.toEntities(result.rows);
  }
}
