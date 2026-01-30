import type { AgencySectorEntity } from '../../entities/agency/AgencyEntity';

export interface AgencyRepository {
  getAgenciesBySector(): Promise<AgencySectorEntity[]>;
}
