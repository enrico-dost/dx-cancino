import { Router } from 'express';
import type { AgencyController } from '../../controllers/agency/AgencyController';
import { authenticateJWT } from '../../../utils/authMiddleware.js';

/**
 * Agency Routes
 * Defines routes for agency operations
 */
export function createAgencyRoutes(agencyController: AgencyController): Router {
  const router = Router();

  /**
   * GET /api/agencies/by-sector/list
   * Get agencies grouped by sector for dropdown
   */
  router.get('/by-sector/list', authenticateJWT, (req, res) => {
    agencyController.getAgenciesBySector(req, res);
  });

  return router;
}
