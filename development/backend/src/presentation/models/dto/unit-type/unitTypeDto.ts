import type { UnitTypeEntity } from '../../../../domain/entities/unit-type/unitTypeEntity';
import type { SuccessResponseDto } from '../GlobalResponseDto';

export interface UnitTypeResponseDto extends SuccessResponseDto<UnitTypeEntity[]> {
  status: number;
  message: string;
  data: UnitTypeEntity[];
}