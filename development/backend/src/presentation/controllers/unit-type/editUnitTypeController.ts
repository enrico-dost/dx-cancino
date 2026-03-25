import { injectable, inject } from "inversify";
import { Response } from "express";
import { EditUnitTypeUseCase } from "../../../domain/use-cases/unit-type/editUnitTypeUseCase";
import { TYPES } from "../../../di/types";
import { AuthenticatedRequest } from "../../../utils/authMiddleware";

@injectable()
export class EditUnitTypeController {
    constructor(@inject(TYPES.EditUnitTypeUseCase) private editUnitTypeUseCase: EditUnitTypeUseCase) { }

    async handle(req: AuthenticatedRequest, res: Response) {
        try {
            const { unit_type_id } = req.params;
            const updateData = req.body;

            if (isNaN(Number(unit_type_id))) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid unit type ID.",
                    data: {}
                });
            }

            if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid request body.",
                    data: {}
                });
            }

            // 1. Validation Logic (Scenario: Invalid Input Data)
            const errors = [];

            if (updateData.is_active !== undefined && typeof updateData.is_active !== "boolean") {
                errors.push({ field: "is_active", message: "is active must be a boolean value." });
            }

            if (updateData.unit_type_name !== undefined) {
                if (typeof updateData.unit_type_name !== "string") {
                    errors.push({ field: "unit_type_name", message: "unit_type_name must be a string." });
                } else if (updateData.unit_type_name.trim() === "") {
                    errors.push({ field: "unit_type_name", message: "unit_type_name must not be empty." });
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation failed.",
                    errors: errors
                });
            }

            // 2. Authentication Check (Scenario: Unauthorized Access)
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized",
                    data: {}
                });
            }

            // 3. Process Update
            const updatedUnitType = await this.editUnitTypeUseCase.execute(Number(unit_type_id), updateData);

            // 4. Check Existence (Scenario: Invalid unit_type_id)
            if (!updatedUnitType) {
                return res.status(404).json({
                    status: 404,
                    message: "Unit type not found.",
                    data: {}
                });
            }

            // 5. Successful Response (Scenario: Successful Update)
            return res.status(200).json({
                status: 200,
                message: "Unit type updated successfully.",
                data: updatedUnitType
            });

        } catch (error) {
            console.error('Error updating unit type:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            });
        }
    }
}