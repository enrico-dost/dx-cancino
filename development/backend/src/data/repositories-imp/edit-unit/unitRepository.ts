import { IUnitRepository } from "../../../domain/repositories/edit-unit/iUnitRepository.js";
import { IDatabaseService } from "../../data-sources/databaseService.js";
import {TYPES } from "../../../di/editUnitTypes.js";
import { inject, injectable } from "inversify";

@injectable()
export class UnitRepository implements IUnitRepository {
  constructor(
    @inject(TYPES.databaseService) private db: IDatabaseService
  ) {}

  async findById(unitId: number) {
    const query = `
      SELECT unit_id, name, org_unit_id, receiving_officer_id
      FROM tblunits
      WHERE unit_id = $1 AND is_active = TRUE;
    `;
    const res = await this.db.query(query, [unitId]);
    return res.rows[0] || null;
  }

  async findByName(name: string) {
    const query = `
      SELECT unit_id, name
      FROM tblunits
      WHERE name = $1 AND is_active = TRUE;
    `;
    const res = await this.db.query(query, [name]);
    return res.rows[0] || null;
  }

  async update(unitId: number, payload: any) {
    const query = `
      UPDATE tblunits
      SET name = $1,
          org_unit_id = $2,
          receiving_officer_id = $3,
          updated_by = $4,
          updated_at = NOW()
      WHERE unit_id = $5
      AND is_active = TRUE
      RETURNING unit_id, name, org_unit_id, receiving_officer_id, updated_at, updated_by;
    `;

    const values = [
      payload.name,
      payload.org_unit_id,
      payload.receiving_officer_id,
      payload.updated_by,
      unitId
    ];

    const res = await this.db.query(query, values);
    return res.rows[0];
  }
}