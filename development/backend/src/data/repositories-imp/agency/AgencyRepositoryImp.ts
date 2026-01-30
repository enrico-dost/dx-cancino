import { injectable, inject } from 'inversify';
import type { AgencyRepository } from '../../../domain/repositories/agency/AgencyRepository';
import type { AgencySectorEntity } from '../../../domain/entities/agency/AgencyEntity';
import { AgencyMapper } from '../../mappers/agency/AgencyMapper';
import { DatabaseService } from '../../data-sources/DatabaseService';
import { TYPES } from '../../../di/types';

/**
 * Agency Repository Implementation
 * Handles database operations for agency data
 */
@injectable()
export class AgencyRepositoryImp implements AgencyRepository {
  constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {}

  /**
   * Get agencies grouped by sector
   * @returns Promise<AgencySectorEntity[]>
   */
  async getAgenciesBySector(): Promise<AgencySectorEntity[]> {
    const query = `
      SELECT
        org_unit_id,
        org_unit_name,
        parent_org_unit_id
      FROM
        tblorganizational_units
      WHERE
        unit_type_id = 1
      ORDER BY
        parent_org_unit_id, org_unit_name;
    `;

    try {
      const result = await this.databaseService.query(query);
      return AgencyMapper.toSectorEntity(result.rows);
    } catch (error) {
      console.error('Error fetching agencies by sector:', error);
      throw new Error('Failed to fetch agencies by sector');
    }
  }
}
