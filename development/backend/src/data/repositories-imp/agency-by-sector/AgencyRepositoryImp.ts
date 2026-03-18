import { injectable, inject } from 'inversify';
import type { AgencyRepository } from '../../../domain/repositories/agency-by-sector/AgencyRepository';
import type { AgencyEntity } from '../../../domain/entities/agency-by-sector/AgencyEntity';
import { agencyMapper } from '../../mappers/agency-by-sector/AgencyMapper';
import { databaseService } from '../../data-sources/DatabaseService';
import { TYPES } from '../../../di/types';

/**
 * Agency Repository Implementation
 * Handles database operations for agency data
 */
@injectable()
export class agencyRepositoryImp implements AgencyRepository {
  constructor(@inject(TYPES.databaseService) private databaseService: databaseService) {}

  /**
   * Get agencies grouped by sector
   * @returns Promise<AgencyEntity[]>
   */
  async getAgenciesBySector(): Promise<AgencyEntity[]> {
    const query = `
      SELECT
        child.org_unit_id,
        child.org_unit_name,
        child.parent_org_unit_id,
        parent.org_unit_name AS sector_name
      FROM
        tblorganizational_units child
      INNER JOIN
        tblorganizational_units parent ON parent.org_unit_id = child.parent_org_unit_id
      WHERE
        child.unit_type_id = 1
        AND child.parent_org_unit_id IN (101, 153, 155, 157)
      ORDER BY
        child.parent_org_unit_id, child.org_unit_name;
    `;

    try {
      const result = await this.databaseService.query(query);
      return agencyMapper.toEntityList(result.rows);
    } catch (error) {
      console.error('Error fetching agencies by sector:', error);
      throw new Error('Failed to fetch agencies by sector');
    }
  }
}
