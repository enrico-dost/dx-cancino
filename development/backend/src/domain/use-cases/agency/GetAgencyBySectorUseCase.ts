import { injectable, inject } from 'inversify';
import type { AgencyRepository } from '../../repositories/agency/AgencyRepository';
import type { AgencySectorEntity } from '../../entities/agency/AgencyEntity';
import { TYPES } from '../../../di/types';

/**
 * Get Agency By Sector Use Case
 * Business logic for retrieving agencies grouped by sector
 */
@injectable()
export class GetAgencyBySectorUseCase {
  constructor(
    @inject(TYPES.AgencyRepository) private agencyRepository: AgencyRepository
  ) {}

  /**
   * Execute the use case to get agencies by sector
   * @returns Promise<AgencySectorEntity[]>
   */
  async execute(): Promise<AgencySectorEntity[]> {
    return await this.agencyRepository.getAgenciesBySector();
  }
}
