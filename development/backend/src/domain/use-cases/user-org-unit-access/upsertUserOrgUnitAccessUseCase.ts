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
    if (!(await this.repo.existsOrgUnit(data.org_unit_id))) {
      throw new Error("Invalid org_unit_id");
    }

    return this.repo.upsertAccess(data);
  }

}
