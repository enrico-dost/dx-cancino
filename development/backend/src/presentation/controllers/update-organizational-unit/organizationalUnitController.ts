import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import type { updateOrganizationalUnitUseCase } from '../../../domain/use-cases/update-organizational-unit/updateOrganizationalUnitUseCase';
import { TYPES } from '../../../di/types';
import type { UpdateOrganizationalUnitRequestDto, OrganizationalUnitResponseDto } from '../../models/dto/update-organizational-unit/organizationalUnitDto';
import type { AuthRequest } from '../../../utils/authMiddleware';

@injectable()
export class organizationalUnitController {
  constructor(
    @inject(TYPES.updateOrganizationalUnitUseCase) private updateOrganizationalUnitUseCase: updateOrganizationalUnitUseCase
  ) {}

  async updateOrganizationalUnit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const orgUnitIdParam = Array.isArray(req.params.org_unit_id) ? req.params.org_unit_id[0] : req.params.org_unit_id;
      const orgUnitId = parseInt(orgUnitIdParam || '', 10);
      
      // Validate org_unit_id
      if (isNaN(orgUnitId)) {
        res.status(400).json({
          status: 400,
          message: 'Invalid org_unit_id: must be a valid integer',
          data: {}
        });
        return;
      }

      const updateData: UpdateOrganizationalUnitRequestDto = req.body;
      // Backward-compatible alias for misspelled longitude key from clients.
      if (updateData.longitude === undefined && updateData.longitutde !== undefined) {
        updateData.longitude = updateData.longitutde;
      }
      
      // Validate that at least one field is provided for update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          status: 400,
          message: 'No update data provided',
          data: {}
        });
        return;
      }

      // Get user ID from JWT token
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          status: 401,
          message: 'Unauthorized'
        });
        return;
      }
      const userIdAsString = String(userId);

      // Validate numeric fields if provided
      if (updateData.unit_type_id !== undefined && (typeof updateData.unit_type_id !== 'number' || isNaN(updateData.unit_type_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid unit_type_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.parent_org_unit_id !== undefined && updateData.parent_org_unit_id !== null && (typeof updateData.parent_org_unit_id !== 'number' || isNaN(updateData.parent_org_unit_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid parent_org_unit_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.region_id !== undefined && updateData.region_id !== null && (typeof updateData.region_id !== 'number' || isNaN(updateData.region_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid region_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.prov_id !== undefined && updateData.prov_id !== null && (typeof updateData.prov_id !== 'number' || isNaN(updateData.prov_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid prov_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.city_id !== undefined && updateData.city_id !== null && (typeof updateData.city_id !== 'number' || isNaN(updateData.city_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid city_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.barangay_id !== undefined && updateData.barangay_id !== null && (typeof updateData.barangay_id !== 'number' || isNaN(updateData.barangay_id))) {
        res.status(400).json({
          status: 400,
          message: 'Invalid barangay_id: must be a valid integer',
          data: {}
        });
        return;
      }
      if (updateData.latitude !== undefined && updateData.latitude !== null) {
        const latitude = typeof updateData.latitude === 'number' ? updateData.latitude : Number(updateData.latitude);
        if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
          res.status(400).json({
            status: 400,
            message: 'Invalid latitude: must be a valid number between -90 and 90',
            data: {}
          });
          return;
        }
        updateData.latitude = latitude;
      }
      if (updateData.longitude !== undefined && updateData.longitude !== null) {
        const longitude = typeof updateData.longitude === 'number' ? updateData.longitude : Number(updateData.longitude);
        if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
          res.status(400).json({
            status: 400,
            message: 'Invalid longitude: must be a valid number between -180 and 180',
            data: {}
          });
          return;
        }
        updateData.longitude = longitude;
      }

      const updatedUnit = await this.updateOrganizationalUnitUseCase.execute(
        orgUnitId,
        updateData,
        userIdAsString
      );

      if (!updatedUnit) {
        res.status(404).json({
          status: 404,
          message: 'Organizational unit not found',
          data: {}
        });
        return;
      }

      const response = {
        status: 200,
        message: 'Organizational unit updated successfully.',
        data: {
          org_unit_id: updatedUnit.org_unit_id,
          org_unit_name: updatedUnit.org_unit_name,
          parent_unit_name: updatedUnit.parent_unit_name,
          unit_type: updatedUnit.unit_type,
          org_unit_descr: updatedUnit.org_unit_descr,
          complete_address: updatedUnit.complete_address,
          latitude: updatedUnit.latitude,
          longitude: updatedUnit.longitude,
          updated_at: updatedUnit.updated_at
        }
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error in updateOrganizationalUnit:', error);
      
      // Handle specific validation errors
      if (error.message && error.message.includes('Invalid parent_org_unit_id')) {
        res.status(400).json({
          status: 400,
          message: error.message,
          data: {}
        });
        return;
      }

      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: {}
      });
    }
  }
}