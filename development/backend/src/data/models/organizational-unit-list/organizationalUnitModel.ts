export interface OrganizationalUnitModel {
  org_unit_id: number;
  org_unit_name: string;
  address: string | null;
  brgy_id: number | null;
  city_id: number | null;
  prov_id: number | null;
  region_id: number | null;
  unit_type: string;
  parent_unit_name: string | null;
}
