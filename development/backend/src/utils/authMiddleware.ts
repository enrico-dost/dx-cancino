import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extended JWT payload interface to support multiple auth types
export interface JwtPayload {
  userId: string | number;
  email?: string;
  role?: string;
  type?: string;
  generatedAt?: string;
}

// Extended Request interface with user context
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Type alias for backward compatibility
export interface AuthRequest extends AuthenticatedRequest {}

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
        message: 'Unauthorized'
      });
      return;
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
      });
      return;
    }

    // Extract the token
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
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
        data: {}
      });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
      });
      return;
    }

    console.error('Error in authenticateJWT middleware:', error);
    res.status(401).json({
      status: 401,
      message: 'Unauthorized'
    });
  }
};

// For Unit Type since the QA wants 'Unauthorized' as default message response
export const getUnitTypeJWT = (
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
        message: 'Unauthorized',
        data: {}
      });
      return;
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized',
        data: {}
      });
      return;
    }

    // Extract the token
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized',
        data: {}
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
        data: {}
      });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized'
      });
      return;
    }

    console.error('Error in authenticateJWT middleware:', error);
    res.status(401).json({
      status: 401,
      message: 'Unauthorized'
    });
  }
};
