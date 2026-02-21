import { injectable, inject } from 'inversify';
import type { OrganizationalUnitRepository } from '../../repositories/organizational-unit-list/organizationalUnitRepository';
import type { OrganizationalUnitEntity } from '../../entities/organizational-unit-list/organizationalUnitEntity';
import { TYPES } from '../../../di/types';

@injectable()
export class getAllOrganizationalUnitsUseCase {
  constructor(
    @inject(TYPES.OrganizationalUnitRepository)
    private organizationalUnitRepository: OrganizationalUnitRepository
  ) {}

  async execute(): Promise<OrganizationalUnitEntity[]> {
    try {
      const organizationalUnits = await this.organizationalUnitRepository.getAllOrganizationalUnits();
      return organizationalUnits;
    } catch (error) {
      console.error('Error in getAllOrganizationalUnitsUseCase:', error);
      throw new Error('Failed to retrieve organizational units');
    }
  }
}