import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        status: 401,
        message: 'Authorization header missing',
      });
      return;
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 401,
        message: 'Invalid authorization format. Expected: Bearer <token>',
      });
      return;
    }

    // Extract the token
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Token missing',
      });
      return;
    }

    // Verify the token
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      res.status(500).json({
        status: 500,
        message: 'Internal server configuration error',
      });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Attach user data to request object
    req.user = decoded;

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 401,
        message: 'Token expired',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 401,
        message: 'Invalid token',
      });
      return;
    }

    console.error('Error in authenticateJWT middleware:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};