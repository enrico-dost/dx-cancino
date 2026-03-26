import { injectable, inject } from "inversify";
import type { Request, Response } from "express";
import { TYPES } from "../../../di/types";
import { createSuccessResponse, createErrorResponse } from "../../models/dto/GlobalResponseDto";
import { UpsertUserOrgUnitAccessUseCase } from "../../../domain/use-cases/user-org-unit-access/upsertUserOrgUnitAccessUseCase";
import { GetUserOrgUnitAccessByUserUseCase } from "../../../domain/use-cases/user-org-unit-access/getUserOrgUnitAccessByUserUseCase";
import type { UserOrgUnitAccessResponseDto } from "../../models/dto/user-org-unit-access/userOrgUnitAccessDto";

@injectable()
export class UserOrgUnitAccessController {
  constructor(
    @inject(TYPES.UpsertUserOrgUnitAccessUseCase)
    private upsertUseCase: UpsertUserOrgUnitAccessUseCase,

    @inject(TYPES.GetUserOrgUnitAccessByUserUseCase)
    private getUseCase: GetUserOrgUnitAccessByUserUseCase
  ) {}

  // PUT /api/user-org-unit-access
  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, org_unit_id, perm_id, is_active } = req.body;

      // Required fields
      if (user_id == null) {
        res.status(400).json({
          error: "Bad Request",
          message: "user_id is required."
        });
        return;
      }

      if (org_unit_id == null) {
        res.status(400).json({
          error: "Bad Request",
          message: "org_unit_id is required."
        });
        return;
      }

      if (perm_id == null) {
        res.status(400).json({
          error: "Bad Request",
          message: "perm_id is required."
        });
        return;
      }

      if (typeof is_active !== "boolean") {
        res.status(400).json({
          error: "Bad Request",
          message: "is_active must be boolean."
        });
        return;
      }

      const { entity, created } = await this.upsertUseCase.execute(req.body);

      let message = "";

      if (created && is_active) {
        message = "User-org-unit access granted successfully.";
      } else if (!created && is_active) {
        message = "User-org-unit access re-activated successfully.";
      } else {
        message = "User-org-unit access deactivated successfully.";
      }

      const statusCode = created ? 201 : 200;

      res.status(statusCode).json({
        message,
        user_id: entity.user_id,
        org_unit_id: entity.org_unit_id,
        perm_id: entity.perm_id,
        is_active: entity.is_active,
        last_modified: entity.updated_at
      });

    } catch (error: any) {
      console.error("Error in upsert:", error);

      res.status(400).json({
        error: "Invalid request.",
        message: error.message
      });
    }
  }

  // GET /api/user-org-unit-access/:user_id
  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const user_id = Number(req.query.user_id) || Number(req.params.user_id);;

      if (!user_id || isNaN(user_id)) {
        res.status(400).json(createErrorResponse("Invalid user_id", 400));
        return;
      }

      const result = await this.getUseCase.execute(user_id);

      const response: UserOrgUnitAccessResponseDto =
        createSuccessResponse(result, 200);

      res.status(200).json(response);

    } catch (error) {
      console.error("Error in UserOrgUnitAccessController.getByUser:", error);
      res.status(500).json(createErrorResponse("Internal server error", 500));
    }
  }

  // POST /api/user-access (Grant only)
  async grant(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, org_unit_id, perm_id } = req.body;

      if (!user_id || !org_unit_id || !perm_id) {
        res.status(400).json({
          error: "Bad Request",
          message: "Missing required fields"
        });
        return;
      }

      const { entity, created } = await this.upsertUseCase.execute({
        user_id,
        org_unit_id,
        perm_id,
        is_active: true
      });

      res.status(created ? 201 : 200).json({
        message: "User-org-unit access granted successfully.",
        user_id: entity.user_id,
        org_unit_id: entity.org_unit_id,
        perm_id: entity.perm_id,
        is_active: entity.is_active,
        last_modified: entity.updated_at
      });

    } catch (error: any) {
      res.status(400).json({
        error: "Invalid request.",
        message: error.message
      });
    }
  }
}