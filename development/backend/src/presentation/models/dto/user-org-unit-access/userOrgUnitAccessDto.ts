import type { UserOrgUnitAccessEntity } from "../../../../domain/entities/user-org-unit-access/userOrgUnitAccessEntity";
import type { SuccessResponseDto } from "../GlobalResponseDto";

export interface UserOrgUnitAccessResponseDto
  extends SuccessResponseDto<UserOrgUnitAccessEntity | UserOrgUnitAccessEntity[]> {
  status: number;
  message: string;
  data: UserOrgUnitAccessEntity | UserOrgUnitAccessEntity[];
}