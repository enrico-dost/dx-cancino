import { injectable, inject } from 'inversify';
import type { ImplementingAgencyRepository } from '../../repositories/implementing-agency/implementingAgencyRepository';
import type { ImplementingAgencyEntity } from '../../entities/implementing-agency/implementingAgencyEntity';
import { TYPES } from '../../../di/types';

/**
 * Get Implementing Agencies By Unit Type Use Case
 * Business logic for retrieving implementing agencies filtered by unit type(s)
 */
@injectable()
export class getImplementingAgenciesByUnitTypeUseCase {
    constructor(
        @inject(TYPES.ImplementingAgencyRepository)
        private implementingAgencyRepository: ImplementingAgencyRepository
    ) { }

    /**
     * Execute the use case to get implementing agencies by unit type(s)
     * @param unitTypeIds Array of unit_type_id values (defaults to [1] if empty)
     * @returns Promise<ImplementingAgencyEntity[]>
     */
    async execute(unitTypeIds: number[]): Promise<ImplementingAgencyEntity[]> {
        // Default to Agency (unit_type_id = 1) if no unit types provided
        const filteredUnitTypeIds = unitTypeIds.length === 0 ? [1] : unitTypeIds;
        return await this.implementingAgencyRepository.getByUnitTypes(filteredUnitTypeIds);
    }
}
