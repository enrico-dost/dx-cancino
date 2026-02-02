import { injectable, inject } from 'inversify';
import type { OrganizationalUnitRepository } from '../../repositories/organizationalunitlist/OrganizationalUnitRepository';
import type { OrganizationalUnitEntity } from '../../entities/organizationalunitlist/OrganizationalUnitEntity';
import { TYPES } from '../../../di/types';

@injectable()
export class GetAllOrganizationalUnitsUseCase {
  constructor(
    @inject(TYPES.OrganizationalUnitRepository)
    private organizationalUnitRepository: OrganizationalUnitRepository
  ) {}

  async execute(): Promise<OrganizationalUnitEntity[]> {
    try {
      const organizationalUnits = await this.organizationalUnitRepository.getAllOrganizationalUnits();
      return organizationalUnits;
    } catch (error) {
      console.error('Error in GetAllOrganizationalUnitsUseCase:', error);
      throw new Error('Failed to retrieve organizational units');
    }
  }
}