import jwt from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// SECURITY: Always use environment variable for JWT_SECRET
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.error('❌ CRITICAL: JWT_SECRET not set in .env file!');
  console.error('⚠️  Using insecure fallback - DO NOT USE IN PRODUCTION!');
  return 'INSECURE_FALLBACK_SECRET';
})();

export const JWT_CONFIG = {
  expiresIn: '365d' as string | number, // 1 year expiration for long-term access
  algorithm: 'HS256' as jwt.Algorithm,
};

/**
 * Generate Dynamic JWT Token
 * @param userId - User ID
 * @param role - User role (admin, user, etc.)
 * @returns JWT Token
 */
export const generateDynamicToken = (userId: string = 'system', role: string = 'admin'): string => {
  const payload = {
    userId,
    role,
    type: 'api-access',
    generatedAt: new Date().toISOString()
  };

  const options: jwt.SignOptions = {
    expiresIn: '365d',
    issuer: 'dost-dx-backend',
    audience: 'dost-dx-client'
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify JWT Token
 * @param token - JWT Token
 * @returns Decoded payload
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};