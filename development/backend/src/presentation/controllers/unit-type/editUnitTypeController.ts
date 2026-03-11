import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { EditUnitTypeUseCase } from "../../../domain/use-cases/unit-type/editUnitTypeUseCase";
import { createSuccessResponse, createErrorResponse } from "../../models/dto/GlobalResponseDto";
import { TYPES } from "../../../di/types";

@injectable()
export class EditUnitTypeController {
    constructor(@inject(TYPES.EditUnitTypeUseCase) private editUnitTypeUseCase: EditUnitTypeUseCase) { }
    async handle(req: Request, res: Response) {
        try {
            const { unit_type_id } = req.params;
            const updateData = req.body;

            if (updateData.is_active !== undefined && typeof updateData.is_active !== "boolean") {
                return res.status(400).json({
                    status: 400,
                    message: "Validation failed.",
                    errors: [{ field: "is_active", message: "is active must be a boolean value." }]
                });
            }

            const updatedUnitType = await this.editUnitTypeUseCase.execute(Number(unit_type_id), updateData);

            if (!updatedUnitType) {
                return res.status(404).json({
                    status: 404,
                    message: "Unit type not found.",
                    data: {}
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Unit type updated successfully.",
                data: updatedUnitType
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
    }
}