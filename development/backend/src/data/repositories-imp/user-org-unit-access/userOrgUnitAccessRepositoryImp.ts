import { injectable, inject } from "inversify";
import type { Pool } from "pg";
import { TYPES } from "../../../di/types";
import type { UserOrgUnitAccessRepository } from "../../../domain/repositories/user-org-unit-access/userOrgUnitAccessRepository";
import type { UserOrgUnitAccessEntity } from "../../../domain/entities/user-org-unit-access/userOrgUnitAccessEntity";
import type { UserOrgUnitAccessModel } from "../../models/user-org-unit-access/userOrgUnitAccessModel";
import { UserOrgUnitAccessMapper } from "../../mappers/user-org-unit-access/userOrgUnitAccessMapper";

@injectable()
export class UserOrgUnitAccessRepositoryImp implements UserOrgUnitAccessRepository {
  constructor(@inject(TYPES.DatabasePool) private pool: Pool) {}

 async upsertAccess(
    data: UserOrgUnitAccessEntity
  ): Promise<{ entity: UserOrgUnitAccessEntity; created: boolean }> {

    const query = `
      INSERT INTO tbluser_org_unit_access
      (user_id, org_unit_id, perm_id, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id, org_unit_id, perm_id)
      DO UPDATE SET
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
      RETURNING *, (xmax = 0) AS created;
    `;

    const result = await this.pool.query<
      UserOrgUnitAccessModel & { created: boolean }
    >(query, [
      data.user_id,
      data.org_unit_id,
      data.perm_id,
      data.is_active,
    ]);

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to upsert user-org-unit access.");
    }

    return {
      entity: UserOrgUnitAccessMapper.toEntity(row),
      created: row.created,
    };
  }

  async existsOrgUnit(org_unit_id: number): Promise<boolean> {
    const query = `
      SELECT 1
      FROM tblorganizational_units
      WHERE org_unit_id = $1
      LIMIT 1;
    `;

    const result = await this.pool.query(query, [org_unit_id]);

    return result.rows.length > 0;
  }


  async getByUserId(user_id: number): Promise<UserOrgUnitAccessEntity[]> {
    const query = `
      SELECT * FROM tbluser_org_unit_access
      WHERE user_id = $1
      ORDER BY updated_at DESC;
    `;

    const result = await this.pool.query<UserOrgUnitAccessModel>(query, [user_id]);

    return UserOrgUnitAccessMapper.toEntities(result.rows);
  }
}
