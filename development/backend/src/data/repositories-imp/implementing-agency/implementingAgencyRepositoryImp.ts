import { injectable, inject } from 'inversify';
import type { ImplementingAgencyRepository } from '../../../domain/repositories/implementing-agency/implementingAgencyRepository';
import type { ImplementingAgencyEntity } from '../../../domain/entities/implementing-agency/implementingAgencyEntity';
import { implementingAgencyMapper } from '../../mappers/implementing-agency/implementingAgencyMapper';
import { databaseService } from '../../data-sources/databaseService';
import { TYPES } from '../../../di/types';

/**
 * Implementing Agency Repository Implementation
 * Handles database operations for implementing agencies
 */
@injectable()
export class implementingAgencyRepositoryImp implements ImplementingAgencyRepository {
    constructor(
        @inject(TYPES.databaseService) private databaseService: databaseService
    ) { }

    /**
     * Get implementing agencies filtered by unit type(s)
     * @param unitTypeIds Array of unit_type_id values to filter by
     * @returns Promise<ImplementingAgencyEntity[]>
     */
    async getByUnitTypes(unitTypeIds: number[]): Promise<ImplementingAgencyEntity[]> {
        try {
            // Query per PBI specification:
            // - Only units where unit_type_id matches the filter
            // - Parent org unit ID is not null
            // - Results ordered by org_unit_name (name, not ID)
            const query = `
            SELECT
                org_unit_id,
                org_unit_name
            FROM
                tblorganizational_units
            WHERE
                unit_type_id = ANY($1::int[])
                AND parent_org_unit_id IS NOT NULL
            ORDER BY
                org_unit_id;
            `;

            // Pass unitTypeIds as array parameter for PostgreSQL ANY() function
            const result = await this.databaseService.query(query, [unitTypeIds]);
            return implementingAgencyMapper.toEntityList(result.rows);
        } catch (error) {
            console.error('Error fetching implementing agencies by unit type:', error);
            throw new Error('Failed to fetch implementing agencies');
        }
    }
}
