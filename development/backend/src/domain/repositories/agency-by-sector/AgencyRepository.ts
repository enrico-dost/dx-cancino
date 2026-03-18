import type { AgencyEntity } from '../../entities/agency-by-sector/AgencyEntity';

export interface AgencyRepository {
  getAgenciesBySector(): Promise<AgencyEntity[]>;
}
