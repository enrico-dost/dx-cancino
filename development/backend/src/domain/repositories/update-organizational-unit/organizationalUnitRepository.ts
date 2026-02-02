import type { OrganizationalUnitEntity, UpdateOrganizationalUnitEntity } from '../../entities/update-organizational-unit/organizationalUnitEntity';

export interface OrganizationalUnitRepository {
  updateOrganizationalUnit(
    orgUnitId: number,
    updateData: UpdateOrganizationalUnitEntity,
    userId: string
  ): Promise<OrganizationalUnitEntity | null>;
  
  findById(orgUnitId: number): Promise<OrganizationalUnitEntity | null>;
  
  validateParentUnit(parentOrgUnitId: number): Promise<boolean>;
}