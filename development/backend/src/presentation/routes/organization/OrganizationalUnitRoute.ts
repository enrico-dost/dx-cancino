import { Router } from 'express';
import type { OrganizationalUnitController } from '../../controllers/organization/OrganizationalUnitController';
import { authenticateJWT } from '../../middleware/authMiddleware';

export function createOrganizationalUnitRoutes(controller: OrganizationalUnitController): Router {
  const router = Router();

  router.get(
    '/organizational-units',
    authenticateJWT,
    (req, res) => controller.getAllOrganizationalUnits(req, res)
  );

  return router;
}