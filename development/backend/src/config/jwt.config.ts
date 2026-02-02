import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// SECURITY: Always use environment variable for JWT_SECRET
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.error('❌ CRITICAL: JWT_SECRET not set in .env file!');
  console.error('⚠️  Using insecure fallback - DO NOT USE IN PRODUCTION!');
  return 'INSECURE_FALLBACK_SECRET';
})();

export const JWT_CONFIG = {
  expiresIn: '24h',
  algorithm: 'HS256' as jwt.Algorithm,
};

// Only show status in development
if (process.env.NODE_ENV !== 'production') {
  console.log('\n===========================================');
  console.log('🔐 JWT Configuration Loaded');
  console.log('JWT_SECRET:', JWT_SECRET !== 'INSECURE_FALLBACK_SECRET' ? '✅ Set' : '❌ Missing');
  console.log('===========================================\n');
}