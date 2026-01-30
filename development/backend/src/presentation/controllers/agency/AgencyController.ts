import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import type { GetAgencyBySectorUseCase } from '../../../domain/use-cases/agency/GetAgencyBySectorUseCase';
import { TYPES } from '../../../di/types';
import type { AgencyBySectorResponseDto, AgencySectorDto, AgencyDto } from '../../models/dto/agency/AgencyDto';
import type { AgencySectorEntity } from '../../../domain/entities/agency/AgencyEntity';

/**
 * Agency Controller
 * Handles HTTP requests for agency operations
 */
@injectable()
export class AgencyController {
  constructor(
    @inject(TYPES.GetAgencyBySectorUseCase) private getAgencyBySectorUseCase: GetAgencyBySectorUseCase
  ) {}

  /**
   * Get agencies grouped by sector
   * @param req Express Request
   * @param res Express Response
   */
  async getAgenciesBySector(req: Request, res: Response): Promise<void> {
    try {
      const agencies: AgencySectorEntity[] = await this.getAgencyBySectorUseCase.execute();
      
      const response: AgencyBySectorResponseDto = {
        data: agencies.map(sector => ({
          org_unit_id: sector.org_unit_id,
          org_unit_name: sector.org_unit_name,
          agencies: sector.agencies.map((agency: AgencyDto) => ({
            org_unit_id: agency.org_unit_id,
            org_unit_name: agency.org_unit_name,
            parent_org_unit_id: agency.parent_org_unit_id
          }))
        }))
      };

      res.status(200).json({
        status: 200,
        message: 'success',
        data: response.data
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
