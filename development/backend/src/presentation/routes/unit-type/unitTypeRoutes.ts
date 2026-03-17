import { Router } from "express";
import type { UnitTypeController } from "../../controllers/unit-type/unitTypeController";
import type { EditUnitTypeController } from "../../controllers/unit-type/editUnitTypeController";
import { getUnitTypeJWT } from "../../../utils/authMiddleware.js";

export function createUnitTypeRoutes(controller: UnitTypeController, editController: EditUnitTypeController): Router {
  const router = Router();

  router.get("/unit-types", getUnitTypeJWT, (req, res) =>
    controller.getAllUnitTypes(req, res)
  );

  router.put("/unit-type/:unit_type_id", (req, res) => 
    editController.handle(req, res)
);

  return router;
}
