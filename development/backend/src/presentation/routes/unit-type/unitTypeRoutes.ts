import { Router } from "express";
import type { UnitTypeController } from "../../controllers/unit-type/unitTypeController";
import { authenticateJWT } from "../../../utils/authMiddleware.js";

export function createUnitTypeRoutes(controller: UnitTypeController): Router {
  const router = Router();

  router.get("/unit-types", authenticateJWT, (req, res) =>
    controller.getAllUnitTypes(req, res)
  );

  return router;
}
