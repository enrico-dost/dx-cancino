import { injectable, inject } from 'inversify';
import type { Request, Response } from 'express';
import { getAllOrganizationalUnitsUseCase } from '../../../domain/use-cases/organizational-unit-list/getOrganizationalUnitUseCase';
import type { OrganizationalUnitResponseDto } from '../../models/dto/organizational-unit-list/organizationalunitDto';
import { createSuccessResponse, createErrorResponse } from '../../models/dto/GlobalResponseDto';
import { TYPES } from '../../../di/types';

@injectable()
export class organizationalUnitController {
  constructor(
    @inject(TYPES.getAllOrganizationalUnitsUseCase)
    private getAllOrganizationalUnitsUseCase: getAllOrganizationalUnitsUseCase
  ) { }

  async getAllOrganizationalUnits(req: Request, res: Response): Promise<void> {
    try {
      const organizationalUnits = await this.getAllOrganizationalUnitsUseCase.execute();

      const response: OrganizationalUnitResponseDto = createSuccessResponse(organizationalUnits);

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in organizationalUnitController.getAllOrganizationalUnits:', error);
      const errorResponse = createErrorResponse('Internal server error', 500);
      res.status(500).json(errorResponse);
    }
  }

  async createOrganizationalUnit(req: Request, res: Response): Promise<void> {
    try {
      const {
        org_unit_id,
        org_unit_name,
        org_unit_descr,
        unit_type_id,
        parent_org_unit_id,
        region_id,
        prov_id,
        city_id,
        barangay_id,
        address,
        latitude,
        longitude
      } = req.body;

      const validationErrors = [];

      if (!parent_org_unit_id) {
        validationErrors.push({ field: "parent_org_unit_id", message: "Parent Organizational Unit does not exist." });
      }
      if (!unit_type_id) {
        validationErrors.push({ field: "unit_type_id", message: "Invalid unit type ID." });
      }
      if (!region_id) {
        validationErrors.push({ field: "region_id", message: "Region ID is required and must be valid." });
      }

      if (validationErrors.length > 0) {
        res.status(400).json({
          status: 400,
          message: "Validation failed.",
          errors: [
            {
              field: "parent_org_unit_id",
              message: "Parent Organizational Unit does not exist."
            },
            {
              field: "unit_type_id",
              message: "Invalid unit type ID."
            },
            {
              field: "region_id",
              message: "Region ID is required and must be valid."
            }
          ]
        });
        return;
      }

      const successData = {
        org_unit_id,
        org_unit_name,
        org_unit_descr,
        unit_type_id,
        parent_org_unit_id,
        region_id,
        prov_id,
        city_id,
        barangay_id,
        address,
        latitude,
        longitude,
        created_at: new Date().toISOString()
      };

      res.status(201).json({
        status: 201,
        message: "Organizational unit created successfully.",
        data: successData
      });

    } catch (error) {
      console.error('Error creating organizational unit:', error);
      res.status(500).json({ status: 500, message: 'Internal server error' });
    }
  }
}