export interface UpdateOrganizationalUnitRequestDto {
  org_unit_name?: string;
  org_unit_descr?: string;
  unit_type_id?: number;
  parent_org_unit_id?: number;
  region_id?: number;
  prov_id?: number;
  city_id?: number;
  barangay_id?: number;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  longitutde?: number | string;
}

export interface OrganizationalUnitResponseDto {
  org_unit_id: number;
  org_unit_name: string;
  parent_unit_name: string | null;
  unit_type: string;
  org_unit_descr?: string;
  complete_address: string;
  latitude?: string;
  longitude?: string;
  updated_at?: string;
}