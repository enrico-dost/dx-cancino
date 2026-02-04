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

// TOKEN MANAGEMENT ON STARTUP
console.log('===========================================');
console.log('🔐 Dynamic JWT Configuration Loaded');
console.log('===========================================');

const TOKEN_FILE = './current_token.json';

// Check if token file exists
if (fs.existsSync(TOKEN_FILE)) {
  try {
    const existingTokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    
    // Verify if token is still valid
    try {
      verifyToken(existingTokenData.token);
      console.log('✅ Using existing token from current_token.json');
      console.log('📅 Generated at:', existingTokenData.generatedAt);
      console.log('Authorization: Bearer', existingTokenData.token);
      console.log('===========================================');
    } catch (error) {
      console.log('⚠️  Existing token expired or invalid, generating new token...');
      
      // Generate new token
      const autoToken = generateDynamicToken();
      const tokenData = {
        token: autoToken,
        generatedAt: new Date().toISOString(),
        expiresIn: JWT_CONFIG.expiresIn,
        userId: 'system',
        role: 'admin'
      };
      
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
      console.log('🚀 New Token Generated (valid for 1 year):');
      console.log('Authorization: Bearer', autoToken);
      console.log('💾 Token saved to: current_token.json');
      console.log('===========================================');
    }
  } catch (error) {
    console.error('❌ Error reading token file, generating new token...');
    
    // Generate new token
    const autoToken = generateDynamicToken();
    const tokenData = {
      token: autoToken,
      generatedAt: new Date().toISOString(),
      expiresIn: JWT_CONFIG.expiresIn,
      userId: 'system',
      role: 'admin'
    };
    
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
    console.log('🚀 New Token Generated (valid for 1 year):');
    console.log('Authorization: Bearer', autoToken);
    console.log('💾 Token saved to: current_token.json');
    console.log('===========================================');
  }
} else {
  console.log('📝 No existing token found, generating new token...');
  
  // Generate token automatically
  const autoToken = generateDynamicToken();
  const tokenData = {
    token: autoToken,
    generatedAt: new Date().toISOString(),
    expiresIn: JWT_CONFIG.expiresIn,
    userId: 'system',
    role: 'admin'
  };
  
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
  console.log('🚀 New Token Generated (valid for 1 year):');
  console.log('Authorization: Bearer', autoToken);
  console.log('💾 Token saved to: current_token.json');
  console.log('===========================================');
}