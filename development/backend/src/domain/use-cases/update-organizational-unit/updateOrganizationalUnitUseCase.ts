import { injectable, inject } from 'inversify';
import type { OrganizationalUnitRepository } from '../../repositories/update-organizational-unit/organizationalUnitRepository';
import type { OrganizationalUnitEntity, UpdateOrganizationalUnitEntity } from '../../entities/update-organizational-unit/organizationalUnitEntity';
import { TYPES } from '../../../di/types';

@injectable()
export class updateOrganizationalUnitUseCase {
  constructor(
    @inject(TYPES.OrganizationalUnitRepository) private organizationalUnitRepository: OrganizationalUnitRepository
  ) {}

  async execute(
    orgUnitId: number,
    updateData: UpdateOrganizationalUnitEntity,
    userId: string
  ): Promise<OrganizationalUnitEntity | null> {
    // Validate that the organizational unit exists
    const existingUnit = await this.organizationalUnitRepository.findById(orgUnitId);
    if (!existingUnit) {
      return null;
    }

    // Validate parent_org_unit_id if provided
    if (updateData.parent_org_unit_id !== undefined && updateData.parent_org_unit_id !== null) {
      const parentExists = await this.organizationalUnitRepository.validateParentUnit(updateData.parent_org_unit_id);
      if (!parentExists) {
        throw new Error('Invalid parent_org_unit_id: Parent unit does not exist');
      }
    }

    // Perform the update
    return await this.organizationalUnitRepository.updateOrganizationalUnit(
      orgUnitId,
      updateData,
      userId
    );
  }
}