export interface UserOrgUnitAccessModel {
  user_access_id: number;
  user_id: number;
  org_unit_id: number;
  perm_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
