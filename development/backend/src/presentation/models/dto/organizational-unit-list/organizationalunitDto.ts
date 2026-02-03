import type { OrganizationalUnitEntity } from '../../../../domain/entities/organizational-unit-list/organizationalUnitEntity';
import type { SuccessResponseDto } from '../GlobalResponseDto';

export interface OrganizationalUnitResponseDto extends SuccessResponseDto<OrganizationalUnitEntity[]> {
  status: number;
  message: string;
  data: OrganizationalUnitEntity[];
}