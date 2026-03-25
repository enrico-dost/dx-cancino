import type { AgencyEntity } from '../../entities/agency-by-sector/agencyEntity';

export interface AgencyRepository {
  getAgenciesBySector(): Promise<AgencyEntity[]>;
}
