// Generate JWT Token for Testing
// Run this with: node generate-token.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not found in .env file!');
  process.exit(1);
}

// Generate a test token valid for 7 days
const token = jwt.sign(
  {
    userId: 1,
    email: 'test@dost.gov.ph',
    role: 'admin',
    type: 'test-token'
  },
  JWT_SECRET,
  {
    expiresIn: '7d',
    algorithm: 'HS256'
  }
);

console.log('\n===========================================');
console.log('🔑 JWT Test Token Generated');
console.log('===========================================');
console.log('\nToken (valid for 7 days):');
console.log(token);
console.log('\n===========================================');
console.log('Use in your API requests:');
console.log(`Authorization: Bearer ${token}`);
console.log('===========================================\n');