export interface UpdateUnitDto {
  name: string;
  org_unit_id: number;
  receiving_officer_id: number;
  members: { user_id: number }[];
}