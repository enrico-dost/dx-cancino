import type { UserOrgUnitAccessEntity } from "../../entities/user-org-unit-access/userOrgUnitAccessEntity";

export interface UserOrgUnitAccessRepository {
  upsertAccess(data: UserOrgUnitAccessEntity): Promise<{ entity: UserOrgUnitAccessEntity; created: boolean }>;
  getByUserId(user_id: number): Promise<UserOrgUnitAccessEntity[]>;

  existsOrgUnit(org_unit_id: number): Promise<boolean>;
}
