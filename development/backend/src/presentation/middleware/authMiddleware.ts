import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../config/jwt.config';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check kung may Authorization header
    if (!authHeader) {
      res.status(401).json({
        status: 401,
        message: 'You do not have permission to access this. (Missing Header)',
        data: {}
      });
      return;
    }

    // 2. I-validate ang format (Bearer <token>)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        status: 401,
        message: 'Invalid token format.',
        data: {}
      });
      return;
    }
    const token = parts[1];

    if (!token) {
      res.status(401).json({ status: 401, message: 'Token missing', data: {} });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        status: 401,
        message: 'Invalid or expired token.',
        data: {}
      });
      return;
    }

    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({
      status: 401,
      message: 'You do not have permission to access this.',
      data: {}
    });
  }
};

export const authMiddleware = authenticateJWT;