import express from 'express';
import { UnitController } from '../../controllers/edit-unit/unitController';
import { authMiddleware } from '../../../presentation/middleware/authMiddleware.js'; 

export const UnitRoutes = (controller: UnitController) => {
  const router = express.Router();

  router.patch(
    '/api/units/:unit_id', 
    authMiddleware, 
    (req, res) => controller.update(req, res)
  );

  return router;
};