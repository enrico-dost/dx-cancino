import { injectable, inject } from 'inversify';
import type { AgencyRepository } from '../../repositories/agency-by-sector/agencyRepository';
import type { AgencyEntity } from '../../entities/agency-by-sector/agencyEntity';
import { TYPES } from '../../../di/types';

/**
 * Get Agency By Sector Use Case
 * Business logic for retrieving agencies grouped by sector
 */
@injectable()
export class getAgencyBySectorUseCase {
  constructor(
    @inject(TYPES.AgencyRepository) private agencyRepository: AgencyRepository
  ) {}

  /**
   * Execute the use case to get agencies by sector
   * @returns Promise<AgencyEntity[]>
   */
  async execute(): Promise<AgencyEntity[]> {
    return await this.agencyRepository.getAgenciesBySector();
  }
}
