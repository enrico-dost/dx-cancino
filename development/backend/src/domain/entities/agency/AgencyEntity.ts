export interface AgencyEntity {
  org_unit_id: number;
  org_unit_name: string;
  parent_org_unit_id: number;
}

export interface AgencySectorEntity {
  org_unit_id: number;
  org_unit_name: string;
  agencies: AgencyEntity[];
}
