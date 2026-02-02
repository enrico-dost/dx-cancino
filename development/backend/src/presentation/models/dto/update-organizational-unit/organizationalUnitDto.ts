export interface UpdateOrganizationalUnitRequestDto {
  org_unit_name?: string;
  org_unit_descr?: string;
  unit_type_id?: number;
  parent_org_unit_id?: number;
  region_id?: number;
  prov_id?: number;
  city_id?: number;
  brgy_id?: number;
  address?: string;
  latitude?: string;
  longitude?: string;
}

export interface OrganizationalUnitResponseDto {
  org_unit_id: number;
  org_unit_name: string;
  parent_unit_name: string | null;
  unit_type: string;
  complete_address: string;
}