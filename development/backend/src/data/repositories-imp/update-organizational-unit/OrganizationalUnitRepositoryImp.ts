import { injectable, inject } from 'inversify';
import type { OrganizationalUnitRepository } from '../../../domain/repositories/update-organizational-unit/organizationalUnitRepository';
import type { OrganizationalUnitEntity, UpdateOrganizationalUnitEntity } from '../../../domain/entities/update-organizational-unit/organizationalUnitEntity';
import { organizationalUnitMapper } from '../../mappers/update-organizational-unit/organizationalUnitMapper';
import { databaseService } from '../../data-sources/databaseService';
import { TYPES } from '../../../di/types';

@injectable()
export class organizationalUnitRepositoryImp implements OrganizationalUnitRepository {
  constructor(@inject(TYPES.databaseService) private databaseService: databaseService) {}

  async findById(orgUnitId: number): Promise<OrganizationalUnitEntity | null> {
    const query = `
      SELECT
        ou.org_unit_id,
        ou.org_unit_name,
        ou.org_unit_descr,
        parent_ou.org_unit_name as parent_unit_name,
        ut.unit_type_name,
        ou.address,
        ou.latitude,
        ou.longitude,
        ou.updated_at
      FROM
        tblorganizational_units ou
      LEFT JOIN tblorganizational_units parent_ou ON ou.parent_org_unit_id = parent_ou.org_unit_id
      LEFT JOIN tblunit_types ut ON ou.unit_type_id = ut.unit_type_id
      WHERE
        ou.org_unit_id = $1;
    `;

    try {
      const result = await this.databaseService.query(query, [orgUnitId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return organizationalUnitMapper.toEntity(result.rows[0]);
    } catch (error) {
      console.error('Error finding organizational unit by ID:', error);
      throw new Error('Failed to find organizational unit');
    }
  }

  async validateParentUnit(parentOrgUnitId: number): Promise<boolean> {
    const query = `
      SELECT org_unit_id FROM tblorganizational_units WHERE org_unit_id = $1;
    `;

    try {
      const result = await this.databaseService.query(query, [parentOrgUnitId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error validating parent unit:', error);
      return false;
    }
  }

  async updateOrganizationalUnit(
    orgUnitId: number,
    updateData: UpdateOrganizationalUnitEntity,
    userId: string
  ): Promise<OrganizationalUnitEntity | null> {
    // Build dynamic UPDATE query based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.org_unit_name !== undefined) {
      fields.push(`org_unit_name = $${paramIndex++}`);
      values.push(updateData.org_unit_name);
    }
    if (updateData.org_unit_descr !== undefined) {
      fields.push(`org_unit_descr = $${paramIndex++}`);
      values.push(updateData.org_unit_descr);
    }
    if (updateData.unit_type_id !== undefined) {
      fields.push(`unit_type_id = $${paramIndex++}`);
      values.push(updateData.unit_type_id);
    }
    if (updateData.parent_org_unit_id !== undefined) {
      fields.push(`parent_org_unit_id = $${paramIndex++}`);
      values.push(updateData.parent_org_unit_id);
    }
    if (updateData.region_id !== undefined) {
      fields.push(`region_id = $${paramIndex++}`);
      values.push(updateData.region_id);
    }
    if (updateData.prov_id !== undefined) {
      fields.push(`prov_id = $${paramIndex++}`);
      values.push(updateData.prov_id);
    }
    if (updateData.city_id !== undefined) {
      fields.push(`city_id = $${paramIndex++}`);
      values.push(updateData.city_id);
    }
    if (updateData.brgy_id !== undefined) {
      fields.push(`brgy_id = $${paramIndex++}`);
      values.push(updateData.brgy_id);
    }
    if (updateData.address !== undefined) {
      fields.push(`address = $${paramIndex++}`);
      values.push(updateData.address);
    }
    if (updateData.latitude !== undefined) {
      fields.push(`latitude = $${paramIndex++}`);
      values.push(updateData.latitude);
    }
    if (updateData.longitude !== undefined) {
      fields.push(`longitude = $${paramIndex++}`);
      values.push(updateData.longitude);
    }

    // Always update updated_by and updated_at
    fields.push(`updated_by = $${paramIndex++}`);
    const userIdAsInt = parseInt(userId, 10);
    values.push(isNaN(userIdAsInt) ? 0 : userIdAsInt);  // Use 0 for system users
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add org_unit_id as the last parameter
    values.push(orgUnitId);

    const query = `
      UPDATE tblorganizational_units
      SET ${fields.join(', ')}
      WHERE org_unit_id = $${paramIndex}
      RETURNING org_unit_id;
    `;

    try {
      const result = await this.databaseService.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }

      // Fetch and return the updated record
      return await this.findById(orgUnitId);
    } catch (error) {
      console.error('Error updating organizational unit:', error);
      throw new Error('Failed to update organizational unit');
    }
  }
}