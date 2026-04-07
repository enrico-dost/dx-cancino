export class UnitMapper {
  static toResponse(unit: any, members: any[]) {
    return {
      unit_id: unit.unit_id,
      name: unit.name,
      org_unit_id: unit.org_unit_id,
      receiving_officer_id: unit.receiving_officer_id,
      members: {
        count: members.length,
        list: members.map(m => ({
          user_id: m.user_id,
          first_name: m.first_name || null,
          last_name: m.last_name || null,
          avatar: m.avatar || null
        }))
      },
      updated_at: unit.updated_at,
      updated_by: unit.updated_by
    };
  }
}