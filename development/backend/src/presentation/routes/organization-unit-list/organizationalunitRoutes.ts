import { Router } from 'express';
import type { OrganizationalUnitController } from '../../controllers/organizational-unit-list/organizationalunitController';
import { authenticateJWT } from '../../../utils/authMiddleware.js';

export function createOrganizationalUnitRoutes(controller: OrganizationalUnitController): Router {
  const router = Router();

  router.get(
    '/organizational-units',
    authenticateJWT,
    (req, res) => controller.getAllOrganizationalUnits(req, res)
  );

  return router;
}