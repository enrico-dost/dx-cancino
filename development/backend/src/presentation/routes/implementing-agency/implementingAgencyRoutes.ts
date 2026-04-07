import { Router } from 'express';
import type { implementingAgencyController } from '../../controllers/implementing-agency/implementingAgencyController';
import { authenticateJWT } from '../../../utils/authMiddleware.js';

/**
 * Implementing Agency Routes
 * Defines routes for implementing agency operations
 */
export function createImplementingAgencyRoutes(
  controller: implementingAgencyController
): Router {
  const router = Router();

  /**
   * GET /api/implementing-agency/unit-type
   * Get implementing agencies by unit type(s)
   * Query parameters:
   *   - unit_types: comma-separated list of unit_type_id values (default: 1)
   * Examples:
   *   - /api/implementing-agency/unit-type (defaults to unit_types=1)
   *   - /api/implementing-agency/unit-type?unit_types=2
   *   - /api/implementing-agency/unit-type?unit_types=1,2
   */
  router.get('/unit-type', authenticateJWT, (req, res) => {
    controller.getByUnitTypes(req, res);
  });

  return router;
}
