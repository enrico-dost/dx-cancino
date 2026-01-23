# 🔐 Dynamic JWT Token Guide

## Overview
This backend uses a Dynamic JWT Token system with **1-year validity** for API authentication. Tokens are automatically generated when the server starts.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd development/backend
npm run dev
```

### 2. Get Your Token
When the server starts, you'll see:
```
===========================================
🔐 Dynamic JWT Configuration Loaded
===========================================
🚀 Auto-Generated Token (valid for 1 year):
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
💾 Token saved to: current_token.json
===========================================
```

### 3. Use the Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/api/agencies/by-sector/list
```

### 🎯 Working Token Example
Here's an actual valid token (expires January 23, 2027):

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzeXN0ZW0iLCJyb2xlIjoiYWRtaW4iLCJ0eXBlIjoiYXBpLWFjY2VzcyIsImdlbmVyYXRlZEF0IjoiMjAyNi0wMS0yM1QwMjoyNjozMC43ODlaIiwiaWF0IjoxNzY5MTM1MTkwLCJleHAiOjE4MDA2NzExOTAsImF1ZCI6ImRvc3QtZHgtY2xpZW50IiwiaXNzIjoiZG9zdC1keC1iYWNrZW5kIn0.TvCRqzv5zKzYf9vPGiPL0JhuWehWKlHX_YfGGxjIsyc" http://localhost:3000/api/agencies/by-sector/list
```

**Token Details:**
- **User ID:** system
- **Role:** admin
- **Type:** api-access
- **Generated:** January 23, 2026
- **Expires:** January 23, 2027 (1 year validity)
- **Status:** ✅ VALID

## 📡 API Endpoints

### Get Token (No Auth Required)
```http
GET /api/auth/token
```

**Response:**
```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "365d",
    "userId": "system",
    "role": "admin"
  }
}
```

### Login with Custom User
```http
POST /api/auth/login
Content-Type: application/json

{
  "userId": "admin",
  "role": "admin"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "365d",
    "userId": "admin",
    "role": "admin"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "userId": "admin",
  "role": "admin"
}
```

## 🔧 Token Usage Examples

### Using with curl
```bash
# Get token first
TOKEN=$(curl -s http://localhost:3000/api/auth/token | jq -r '.data.token')

# Use token in API calls
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/agencies/by-sector/list
```

### Using with Postman
1. **Headers Tab:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

2. **Environment Variables:**
   - `token`: Copy from response
   - `authorization`: `Bearer {{token}}`

### Using with JavaScript
```javascript
// Get token
const response = await fetch('http://localhost:3000/api/auth/token');
const { data } = await response.json();
const token = data.token;

// Use token
const apiResponse = await fetch('http://localhost:3000/api/agencies/by-sector/list', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📁 Token Storage

### Console Output
Token is displayed in console when server starts.

### File Storage
Token is automatically saved to `current_token.json`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "generatedAt": "2026-01-23T10:16:30.123Z",
  "expiresIn": "365d",
  "userId": "system",
  "role": "admin"
}
```

## 🔍 Token Structure

### Payload
```json
{
  "userId": "system",
  "role": "admin",
  "type": "api-access",
  "generatedAt": "2026-01-23T10:16:30.123Z",
  "iat": 1769135790,
  "exp": 1800671790
}
```

### Claims
- `userId`: User identifier (default: "system")
- `role`: User role (default: "admin")
- `type`: Token type ("api-access")
- `generatedAt`: ISO timestamp when token was created
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (1 year from creation)

## 🛡️ Security Features

### Token Validation
- Uses `JWT_SECRET` from environment variables
- Validates token signature
- Checks expiration automatically

### Middleware Usage
```typescript
import { authenticateJWT } from '../utils/authMiddleware.js';

// Protect routes
router.get('/protected', authenticateJWT, (req, res) => {
  // req.user contains decoded token payload
  res.json({ user: req.user });
});
```

## 🔧 Configuration

### Environment Variables
```env
JWT_SECRET=your-super-secret-key-here
PORT=3000
```

### JWT Configuration
- **Expiration**: 365 days (1 year)
- **Issuer**: dost-dx-backend
- **Audience**: dost-dx-client

## 🚨 Important Notes

1. **Token Validity**: Tokens are valid for **1 year** from creation
2. **Auto-Generation**: New token generated on every server restart
3. **File Storage**: Check `current_token.json` for latest token
4. **Security**: Keep `JWT_SECRET` secure and don't commit to version control
5. **No Database**: Tokens are stateless, no database storage required

## 🔄 Token Refresh

Since tokens are valid for 1 year, refresh is typically not needed. However:
- Use `/api/auth/refresh` to generate new tokens
- Use `/api/auth/login` for custom user/role tokens
- Restart server to get new system token

## 🐛 Troubleshooting

### Common Errors

#### 401 Unauthorized
```json
{
  "status": 401,
  "message": "unauthorized",
  "data": {}
}
```
**Solution:** Check token format and validity

#### Token Expired
**Solution:** Get new token from `/api/auth/token` or restart server

#### Invalid Token Format
**Solution:** Ensure `Authorization: Bearer TOKEN` format

### Debug Steps
1. Check console output for token
2. Verify `current_token.json` exists
3. Validate JWT_SECRET is set
4. Check token expiration date

## 📞 Support

For issues with JWT authentication:
1. Check server logs
2. Verify token format
3. Ensure proper Authorization header
4. Check network connectivity

---

**Last Updated:** January 23, 2026  
**Version:** 1.0.0  
**Backend:** DX Organization Management Backend
