import { injectable, inject } from "inversify";
import type { Request, Response } from "express";
import { TYPES } from "../../../di/types";
import { createSuccessResponse, createErrorResponse } from "../../models/dto/GlobalResponseDto";
import { UpsertUserOrgUnitAccessUseCase } from "../../../domain/use-cases/user-org-unit-access/upsertUserOrgUnitAccessUseCase";
import { GetUserOrgUnitAccessByUserUseCase } from "../../../domain/use-cases/user-org-unit-access/getUserOrgUnitAccessByUserUseCase";

@injectable()
export class UserOrgUnitAccessController {
  constructor(
    @inject(TYPES.UpsertUserOrgUnitAccessUseCase)
    private upsertUseCase: UpsertUserOrgUnitAccessUseCase,

    @inject(TYPES.GetUserOrgUnitAccessByUserUseCase)
    private getUseCase: GetUserOrgUnitAccessByUserUseCase
  ) {}

  // ==========================
  // PUT /api/user-org-unit-access
  // ==========================
  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, org_unit_id, perm_id, is_active } = req.body;

      if (user_id == null) {
        res.status(400).json(createErrorResponse("user_id is required", 400));
        return;
      }

      if (org_unit_id == null) {
        res.status(400).json(createErrorResponse("org_unit_id is required", 400));
        return;
      }

      if (perm_id == null) {
        res.status(400).json(createErrorResponse("perm_id is required", 400));
        return;
      }

      if (typeof is_active !== "boolean") {
        res.status(400).json(createErrorResponse("is_active must be boolean", 400));
        return;
      }

      const { entity, created } = await this.upsertUseCase.execute({
        user_id,
        org_unit_id,
        perm_id,
        is_active
      });

      const statusCode = created ? 201 : 200;

      res.status(statusCode).json(
        createSuccessResponse({
          user_access_id: entity.user_access_id,
          user_id: entity.user_id,
          org_unit_id: entity.org_unit_id,
          perm_id: entity.perm_id,
          is_active: entity.is_active,
          created_at: entity.created_at,
          updated_at: entity.updated_at,
          created
        }, statusCode)
      );

      return;

    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message || "Invalid request.",
        data: {}
      });
      return;
    }
  }

  // ==========================
  // GET /api/user-org-unit-access?user_id=2
  // ==========================
  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const user_id = Number(req.params.user_id) || Number(req.query.user_id);

      if (!user_id || isNaN(user_id)) {
        res.status(400).json(createErrorResponse("Invalid user_id", 400));
        return;
      }

      const result = await this.getUseCase.execute(user_id);

      res.status(200).json(
        createSuccessResponse(
          result.map(item => ({
            user_access_id: item.user_access_id,
            user_id: item.user_id,
            org_unit_id: item.org_unit_id,
            perm_id: item.perm_id,
            is_active: item.is_active,
            created_at: item.created_at,
            updated_at: item.updated_at
          })),
          200
        )
      );

      return;

    } catch (error) {
      res.status(500).json(createErrorResponse("Internal server error", 500));
      return;
    }
  }

  // ==========================
  // POST /api/user-access
  // ==========================
  async grant(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, org_unit_id, perm_id } = req.body;

      if (user_id == null) {
        res.status(400).json(createErrorResponse("user_id is required", 400));
        return;
      }

      if (org_unit_id == null) {
        res.status(400).json(createErrorResponse("org_unit_id is required", 400));
        return;
      }

      if (perm_id == null) {
        res.status(400).json(createErrorResponse("perm_id is required", 400));
        return;
      }

      const { entity, created } = await this.upsertUseCase.execute({
        user_id,
        org_unit_id,
        perm_id,
        is_active: true
      });

      res.status(created ? 201 : 200).json(
        createSuccessResponse({
          user_access_id: entity.user_access_id,
          user_id: entity.user_id,
          org_unit_id: entity.org_unit_id,
          perm_id: entity.perm_id,
          is_active: entity.is_active,
          created_at: entity.created_at,
          updated_at: entity.updated_at,
          created
        }, created ? 201 : 200)
      );

      return;

    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message || "Invalid request.",
        data: {}
      });
      return;
    }
  }
}