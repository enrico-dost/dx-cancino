import type { OrganizationalUnitEntity } from '../../../domain/entities/update-organizational-unit/organizationalUnitEntity';

export class OrganizationalUnitMapper {
  static toEntity(row: any): OrganizationalUnitEntity {
    return {
      org_unit_id: row.org_unit_id,
      org_unit_name: row.org_unit_name,
      parent_unit_name: row.parent_unit_name || null,
      unit_type: row.unit_type_name || '',
      complete_address: row.address || ''
    };
  }
}