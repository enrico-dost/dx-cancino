import { injectable, inject } from "inversify";
import type { UserOrgUnitAccessRepository } from "../../repositories/user-org-unit-access/userOrgUnitAccessRepository";
import type { UserOrgUnitAccessEntity } from "../../entities/user-org-unit-access/userOrgUnitAccessEntity";
import { TYPES } from "../../../di/types";

@injectable()
export class GetUserOrgUnitAccessByUserUseCase {
  constructor(
    @inject(TYPES.UserOrgUnitAccessRepository)
    private repository: UserOrgUnitAccessRepository
  ) {}

  async execute(userId: number): Promise<UserOrgUnitAccessEntity[]> {
    return this.repository.getByUserId(userId);
  }
}

