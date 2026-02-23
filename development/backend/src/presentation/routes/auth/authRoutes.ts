import { Router } from 'express';
import type { authController } from '../../controllers/auth/authController';

export function createAuthRoutes(controller: authController): Router {
  const router = Router();

  // Login endpoint - no authentication required
  router.post('/login', (req, res) => controller.login(req, res));

  // Refresh token endpoint - no authentication required
  router.post('/refresh', (req, res) => controller.refreshToken(req, res));

  // Get token endpoint - no authentication required
  router.get('/token', (req, res) => controller.getToken(req, res));

  return router;
}
