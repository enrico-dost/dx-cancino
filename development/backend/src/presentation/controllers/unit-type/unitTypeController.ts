import { injectable, inject } from "inversify";
import type { Request, Response } from "express";
import { GetAllUnitTypesUseCase } from "../../../domain/use-cases/unit-type/getAllUnitTypesUseCase";
import type { UnitTypeResponseDto } from "../../models/dto/unit-type/unitTypeDto";
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

      const response: UnitTypeResponseDto = createSuccessResponse(unitTypes);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in UnitTypeController.getAllUnitTypes:", error);
      const errorResponse = createErrorResponse("Internal server error", 500);
      res.status(500).json(errorResponse);
    }
  }
}