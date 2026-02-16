import { injectable, inject } from "inversify";
import type { Request, Response } from "express";
import { GetAllUnitTypesUseCase } from "../../../domain/use-cases/unit-type/getAllUnitTypesUseCase";
import { createSuccessResponse, createErrorResponse } from "../../models/dto/GlobalResponseDto";
import { TYPES } from "../../../di/types";

@injectable()
export class UnitTypeController {
  constructor(
    @inject(TYPES.GetAllUnitTypesUseCase)
    private getAllUnitTypesUseCase: GetAllUnitTypesUseCase
  ) {}

  async getAllUnitTypes(req: Request, res: Response): Promise<void> {
    try {
      const unitTypes = await this.getAllUnitTypesUseCase.execute();

      const response = createSuccessResponse(unitTypes);

      if (unitTypes.length === 0) {
        response.message = "No unit types found.";
      } else {
        response.message = "Unit types retrieved successfully.";
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(createErrorResponse("Internal server error", 500));
    }
  }
}
