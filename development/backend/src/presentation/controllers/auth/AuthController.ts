import { injectable } from 'inversify';
import type { Request, Response } from 'express';
import { generateDynamicToken } from '../../../config/jwt.config';
import { createSuccessResponse, createErrorResponse } from '../../models/dto/GlobalResponseDto';

@injectable()
export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { userId = 'system', role = 'admin' } = req.body;

      // Generate dynamic token
      const token = generateDynamicToken(userId, role);

      const response = createSuccessResponse({
        token,
        tokenType: 'Bearer',
        expiresIn: '365d',
        userId,
        role
      });

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in AuthController.login:', error);
      const errorResponse = createErrorResponse('Internal server error', 500);
      res.status(500).json(errorResponse);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = req.body;
      
      // Generate new token
      const newToken = generateDynamicToken(userId, role);

      const response = createSuccessResponse({
        token: newToken,
        tokenType: 'Bearer',
        expiresIn: '365d',
        userId,
        role
      });

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in AuthController.refreshToken:', error);
      const errorResponse = createErrorResponse('Internal server error', 500);
      res.status(500).json(errorResponse);
    }
  }

  async getToken(req: Request, res: Response): Promise<void> {
    try {
      // Generate system token
      const token = generateDynamicToken();

      const response = createSuccessResponse({
        token,
        tokenType: 'Bearer',
        expiresIn: '365d',
        userId: 'system',
        role: 'admin'
      });

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in AuthController.getToken:', error);
      const errorResponse = createErrorResponse('Internal server error', 500);
      res.status(500).json(errorResponse);
    }
  }
}
