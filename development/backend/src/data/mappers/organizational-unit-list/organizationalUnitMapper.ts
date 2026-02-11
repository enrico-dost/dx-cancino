import type { OrganizationalUnitModel } from '../../models/organizational-unit-list/organizationalUnitModel';
import type { OrganizationalUnitEntity } from '../../../domain/entities/organizational-unit-list/organizationalUnitEntity';

export class OrganizationalUnitMapper {
  /**
   * @param model The database model with raw data
   * @param completeAddress The enriched complete address string
   * @returns 
   */
  static toEntity(model: OrganizationalUnitModel, completeAddress: string): OrganizationalUnitEntity {
    return {
      org_unit_id: model.org_unit_id,
      org_unit_name: model.org_unit_name,
      parent_unit_name: model.parent_unit_name,
      unit_type: model.unit_type,
      complete_address: completeAddress,
    };
  }

  /**
   * Converts multiple database models to domain entities
   * @param models Array of database models
   * @param addressMap Map of org_unit_id to complete address
   * @returns Array of domain entities
   */
  static toEntities(models: OrganizationalUnitModel[], addressMap: Map<number, string>): OrganizationalUnitEntity[] {
    return models.map(model => 
      this.toEntity(model, addressMap.get(model.org_unit_id) || '')
    );
  }
}
