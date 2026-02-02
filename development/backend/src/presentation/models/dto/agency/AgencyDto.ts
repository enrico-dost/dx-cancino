export interface AgencyDto {
  org_unit_id: number;
  org_unit_name: string;
  parent_org_unit_id: number;
}

export interface AgencySectorDto {
  org_unit_id: number;
  org_unit_name: string;
  agencies: AgencyDto[];
}

export interface AgencyBySectorResponseDto {
  data: AgencySectorDto[];
}
