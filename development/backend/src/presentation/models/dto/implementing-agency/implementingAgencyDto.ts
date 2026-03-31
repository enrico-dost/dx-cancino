/**
 * Implementing Agency DTO
 * Data Transfer Objects for implementing agency responses
 */

export interface ImplementingAgencyDto {
  org_unit_id: number;
  org_unit_name: string;
}

/**
 * Array of implementing agencies
 */
export type ImplementingAgencyListDto = ImplementingAgencyDto[];
