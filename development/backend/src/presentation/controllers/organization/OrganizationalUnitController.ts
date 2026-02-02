import { injectable, inject } from 'inversify';
import type { Request, Response } from 'express';
import { GetAllOrganizationalUnitsUseCase } from '../../../domain/use-cases/organizationalunitlist/getOrganizationalUnitUseCase';
import type { OrganizationalUnitResponseDto } from '../../models/dto/organizationalunitlist/OrganizationalUnitDto.ts';
import { createSuccessResponse, createErrorResponse } from '../../models/dto/GlobalResponseDto';
import { TYPES } from '../../../di/types';

@injectable()
export class OrganizationalUnitController {
  constructor(
    @inject(TYPES.GetAllOrganizationalUnitsUseCase)
    private getAllOrganizationalUnitsUseCase: GetAllOrganizationalUnitsUseCase
  ) {}

  async getAllOrganizationalUnits(req: Request, res: Response): Promise<void> {
    try {
      const organizationalUnits = await this.getAllOrganizationalUnitsUseCase.execute();

      const response: OrganizationalUnitResponseDto = createSuccessResponse(organizationalUnits);

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in OrganizationalUnitController.getAllOrganizationalUnits:', error);
      const errorResponse = createErrorResponse('Internal server error', 500);
      res.status(500).json(errorResponse);
    }
  }
}