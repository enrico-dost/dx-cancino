export interface OrganizationalUnitEntity {
  org_unit_id: number;
  org_unit_name: string;
  parent_unit_name: string | null;
  unit_type: string;
  complete_address: string;
}