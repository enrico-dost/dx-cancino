import type { OrganizationalUnitEntity } from '../../../domain/entities/update-organizational-unit/organizationalUnitEntity';

export class organizationalUnitMapper {
  static toEntity(row: any): OrganizationalUnitEntity {
    return {
      org_unit_id: row.org_unit_id,
      org_unit_name: row.org_unit_name,
      parent_unit_name: row.parent_unit_name || null,
      unit_type: row.unit_type_name || '',
      org_unit_descr: row.org_unit_descr || undefined,
      complete_address: row.address || '',
      latitude: row.latitude || undefined,
      longitude: row.longitude || undefined,
      updated_at: row.updated_at || undefined
    };
  }
}