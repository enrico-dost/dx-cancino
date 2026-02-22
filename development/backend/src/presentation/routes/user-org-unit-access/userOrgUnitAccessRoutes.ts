import { Router } from "express";
import type { UserOrgUnitAccessController } from "../../controllers/user-org-unit-access/userOrgUnitAccessController";
import { authenticateJWT } from "../../../utils/authMiddleware.js";

export function createUserOrgUnitAccessRoutes(controller: UserOrgUnitAccessController): Router {
  const router = Router();

  router.put("/user-org-unit-access", authenticateJWT, (req, res) =>
    controller.upsert(req, res)
  );

  router.get("/user-org-unit-access/:user_id", authenticateJWT, (req, res) =>
    controller.getByUser(req, res)
  );

  router.post("/user-access", authenticateJWT, (req, res) =>
    controller.grant(req, res)
  );
  
  return router;
}
