import type { ImplementingAgencyEntity } from '../../entities/implementing-agency/implementingAgencyEntity';

/**
 * Implementing Agency Repository Interface
 * Contract for retrieving implementing agencies by unit type
 */
export interface ImplementingAgencyRepository {
  /**
   * Get implementing agencies by unit type(s)
   * @param unitTypeIds Array of unit_type_id values to filter by
   * @returns Promise<ImplementingAgencyEntity[]>
   */
  getByUnitTypes(unitTypeIds: number[]): Promise<ImplementingAgencyEntity[]>;
}
