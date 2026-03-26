import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import type { UserOrgUnitAccessRepository } from "../../repositories/user-org-unit-access/userOrgUnitAccessRepository";
import type { UserOrgUnitAccessEntity } from "../../entities/user-org-unit-access/userOrgUnitAccessEntity";

@injectable()
export class UpsertUserOrgUnitAccessUseCase {
  constructor(
    @inject(TYPES.UserOrgUnitAccessRepository)
    private repo: UserOrgUnitAccessRepository
  ) {}

  async execute(data: UserOrgUnitAccessEntity) {

    if (!Number.isInteger(data.user_id)) {
      throw new Error("Invalid user_id");
    }

    if (!Number.isInteger(data.org_unit_id)) {
      throw new Error("Invalid org_unit_id");
    }

    if (!Number.isInteger(data.perm_id)) {
      throw new Error("Invalid perm_id");
    }

    if (!(await this.repo.existsOrgUnit(data.org_unit_id))) {
      throw new Error("User not found or invalid org_unit_id provided.");
    }

    return this.repo.upsertAccess(data);
  }
}
