import type { OrganizationalUnitEntity } from '../../../../domain/entities/organizationalunitlist/OrganizationalUnitEntity';
import type { SuccessResponseDto } from '../GlobalResponseDto';

export interface OrganizationalUnitResponseDto extends SuccessResponseDto<OrganizationalUnitEntity[]> {
  status: number;
  message: string;
  data: OrganizationalUnitEntity[];
}