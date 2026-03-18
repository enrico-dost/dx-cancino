import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import type { getAgencyBySectorUseCase } from '../../../domain/use-cases/agency-by-sector/GetAgencyBySectorUseCase';
import { TYPES } from '../../../di/types';
import type { AgencyBySectorDataDto, AgencySectorDto } from '../../models/dto/agency-by-sector/AgencyDto';
import type { AgencyEntity } from '../../../domain/entities/agency-by-sector/AgencyEntity';

/**
 * Agency Controller
 * Handles HTTP requests for agency operations
 */
@injectable()
export class agencyController {
  constructor(
    @inject(TYPES.getAgencyBySectorUseCase) private getAgencyBySectorUseCase: getAgencyBySectorUseCase
  ) {}

  /**
   * Get agencies grouped by sector
   * @param req Express Request
   * @param res Express Response
   */
  async getAgenciesBySector(req: Request, res: Response): Promise<void> {
    try {
      const agencies: AgencyEntity[] = await this.getAgencyBySectorUseCase.execute();

      if (agencies.length === 0) {
        res.status(200).json({
          status: 200,
          message: 'No agencies found.',
          data: []
        });
        return;
      }

      const sectorsByParentId = new Map<number, AgencySectorDto>();

      agencies.forEach((agency: AgencyEntity) => {
        const existingSector = sectorsByParentId.get(agency.parent_org_unit_id);

        if (!existingSector) {
          sectorsByParentId.set(agency.parent_org_unit_id, {
            org_unit_id: agency.parent_org_unit_id,
            org_unit_name: agency.sector_name,
            agencies: []
          });
        }

        sectorsByParentId.get(agency.parent_org_unit_id)!.agencies.push({
          org_unit_id: agency.org_unit_id,
          org_unit_name: agency.org_unit_name,
          parent_org_unit_id: agency.parent_org_unit_id
        });
      });

      const groupedData: AgencyBySectorDataDto = Array.from(sectorsByParentId.values());

      res.status(200).json({
        status: 200,
        message: 'Agency dropdown list retrieved successfully.',
        data: groupedData
      });
    } catch (error) {
      console.error('Error in getAgenciesBySector:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: {}
      });
    }
  }
}
