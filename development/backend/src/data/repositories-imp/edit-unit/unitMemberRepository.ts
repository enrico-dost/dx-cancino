import { IUnitMemberRepository } from "../../../domain/repositories/edit-unit/iUnitMemberRepository.js";
import { IDatabaseService } from "../../data-sources/databaseService.js";
import {TYPES } from "../../../di/editUnitTypes.js";
import { inject, injectable } from "inversify";

@injectable()
export class UnitMemberRepository implements IUnitMemberRepository {
    constructor(
    @inject(TYPES.databaseService) private db: IDatabaseService
  ) {}

  async deleteByUnitId(unitId: number, updatedBy: number): Promise<void> {
    const query = `
      DELETE FROM tblunit_members WHERE unit_id = $1;
    `;
    await this.db.query(query, [unitId]);
  }

  async saveMembers(unitId: number, userIds: number[], createdBy: number): Promise<void> {
    for (const userId of userIds) {
      const query = `
        INSERT INTO tblunit_members (unit_id, user_id, created_by, created_at)
        VALUES ($1, $2, $3, NOW());
      `;
      await this.db.query(query, [unitId, userId, createdBy]);
    }
  }

  async findByUnitId(unitId: number): Promise<any[]> {
    const query = `
      SELECT user_id
      FROM tblunit_members
      WHERE unit_id = $1;
    `;
    const res = await this.db.query(query, [unitId]);
    return res.rows;
  }
}