import { Router } from 'express';
import type { organizationalUnitController } from '../../controllers/update-organizational-unit/organizationalUnitController';
import { authenticateJWT } from '../../../utils/authMiddleware';

export function createOrganizationalUnitRoutes(organizationalUnitController: organizationalUnitController): Router {
  const router = Router();

  /**
   * PUT /api/organizational-units/:org_unit_id
   * Update an organizational unit
   */
  router.put('/:org_unit_id', authenticateJWT, (req, res) => {
    organizationalUnitController.updateOrganizationalUnit(req, res);
  });

  return router;
}