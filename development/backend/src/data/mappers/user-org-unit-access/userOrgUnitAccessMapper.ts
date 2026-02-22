import type { UserOrgUnitAccessModel } from "../../models/user-org-unit-access/userOrgUnitAccessModel";
import type { UserOrgUnitAccessEntity } from "../../../domain/entities/user-org-unit-access/userOrgUnitAccessEntity";

export class UserOrgUnitAccessMapper {
  static toEntity(model: UserOrgUnitAccessModel): UserOrgUnitAccessEntity {
    return { ...model };
  }

  static toEntities(models: UserOrgUnitAccessModel[]): UserOrgUnitAccessEntity[] {
    return models.map(this.toEntity);
  }
}
