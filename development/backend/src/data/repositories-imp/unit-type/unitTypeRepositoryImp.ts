import { injectable, inject } from "inversify";
import type { Pool } from "pg";
import type { UnitTypeRepository } from "../../../domain/repositories/unit-type/unitTypeRepository";
import type { UnitTypeEntity } from "../../../domain/entities/unit-type/unitTypeEntity";
import type { UnitTypeModel } from "../../models/unit-type/unitTypeModel";
import { UnitTypeMapper } from "../../mappers/unit-type/unitTypeMapper";
import { TYPES } from "../../../di/types";

@injectable()
export class UnitTypeRepositoryImp implements UnitTypeRepository {
  constructor(@inject(TYPES.DatabasePool) private pool: Pool) { }

  async getAllUnitTypes(): Promise<UnitTypeEntity[]> {
    const query = `
      SELECT unit_type_id, unit_type_name, unit_type_descr, is_active
      FROM tblunit_types
      ORDER BY unit_type_id;
    `;

    const result = await this.pool.query<UnitTypeModel>(query);

    return UnitTypeMapper.toEntities(result.rows);
  }

  async update(unitTypeId: number, data: Partial<UnitTypeEntity>): Promise<UnitTypeEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let placeholderIndex = 1;

    if (data.unit_type_name !== undefined) {
      fields.push(`unit_type_name = $${placeholderIndex++}`);
      values.push(data.unit_type_name);
    }
    if (data.unit_type_descr !== undefined) {
      fields.push(`unit_type_descr = $${placeholderIndex++}`);
      values.push(data.unit_type_descr);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${placeholderIndex++}`);
      values.push(data.is_active);
    }

    if (fields.length === 0) return null;

    values.push(unitTypeId);
    const query = `
      UPDATE tblunit_types
      SET ${fields.join(', ')}
      WHERE unit_type_id = $${placeholderIndex}
      RETURNING unit_type_id, unit_type_name, unit_type_descr, is_active, updated_at;
    `;

    const result = await this.pool.query<UnitTypeModel>(query, values);

    if (!result.rows || result.rows.length === 0 || !result.rows[0]) {
      return null; // This triggers the 404 Not Found response in your controller [cite: 33, 38]
    }

    return UnitTypeMapper.toEntity(result.rows[0]);
  }
}
