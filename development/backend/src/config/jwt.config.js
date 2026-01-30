import jwt from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Generate Dynamic JWT Token
 * @param {string} userId - User ID
 * @param {string} role - User role (admin, user, etc.)
 * @returns {string} JWT Token
 */
export const generateDynamicToken = (userId = 'system', role = 'admin') => {
  const payload = {
    userId,
    role,
    type: 'api-access',
    generatedAt: new Date().toISOString()
  };

  const options = {
    expiresIn: '365d', // 1 year expiration
    issuer: 'dost-dx-backend',
    audience: 'dost-dx-client'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Verify JWT Token
 * @param {string} token - JWT Token
 * @returns {object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// AUTO-GENERATE ON STARTUP
console.log('===========================================');
console.log('🔐 Dynamic JWT Configuration Loaded');
console.log('===========================================');

// Generate token automatically
const autoToken = generateDynamicToken();

// Display in console
console.log('🚀 Auto-Generated Token (valid for 1 year):');
console.log('Authorization: Bearer', autoToken);

// Save to file
const tokenData = {
  token: autoToken,
  generatedAt: new Date().toISOString(),
  expiresIn: '365d',
  userId: 'system',
  role: 'admin'
};

fs.writeFileSync('./current_token.json', JSON.stringify(tokenData, null, 2));
console.log('💾 Token saved to: current_token.json');
console.log('===========================================');
