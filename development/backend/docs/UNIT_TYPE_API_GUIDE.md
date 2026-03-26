# 🏷️ Unit Type API Guide

## Overview
The Unit Type API provides endpoints for retrieving all available organizational unit types such as Agency, Regional Office, Department, and more. This API is primarily used for dropdown/select UI components and classification systems within the DX Organization Management Backend.

All endpoints require JWT authentication.

---

## 🎯 User Story
**As a system user, I want to retrieve a list of all organizational unit types, so that I can correctly classify and categorize new or existing organizational units.**

---

## 🔐 Authentication
All Unit Type API endpoints require JWT authentication.

### Required Header
```http
Authorization: Bearer YOUR_JWT_TOKEN
Accept: application/json
```

---

## 📡 API Endpoint

### Get All Unit Types
```http
GET /api/unit-types
```

---

## ✅ Response Examples

### Success (200)
```json
{
  "status": 200,
  "message": "Unit types retrieved successfully.",
  "data": [
    {
      "unit_type_id": 1,
      "unit_type_name": "Agency",
      "unit_type_descr": "A primary government body or department.",
      "is_active": true
    },
    {
      "unit_type_id": 2,
      "unit_type_name": "Regional Office",
      "unit_type_descr": "Administrative unit for regions.",
      "is_active": true
    }
  ]
}
```

### Empty Data (200)
```json
{
  "status": 200,
  "message": "No unit types found.",
  "data": []
}
```

### Unauthorized (401)
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

### Server Error (500)
```json
{
  "status": 500,
  "message": "Internal server error",
  "data": {}
}
```

---

## 🔧 Usage Examples

### curl
```bash
TOKEN=$(curl -s http://localhost:8080/api/auth/token | jq -r '.data.token')

curl -H "Authorization: Bearer $TOKEN"      -H "Accept: application/json"      http://localhost:8080/api/unit-types
```

---

### Postman
- Method: GET  
- URL: http://localhost:8080/api/unit-types  
- Authorization: Bearer Token  

---

### JavaScript
```javascript
async function getUnitTypes() {
  const tokenRes = await fetch('http://localhost:8080/api/auth/token');
  const tokenData = await tokenRes.json();

  const res = await fetch('http://localhost:8080/api/unit-types', {
    headers: {
      Authorization: `Bearer ${tokenData.data.token}`,
      Accept: 'application/json'
    }
  });

  return await res.json();
}
```

---

## 📊 Data Structure

### UnitType
```ts
interface UnitType {
  unit_type_id: number;
  unit_type_name: string;
  unit_type_descr: string;
  is_active: boolean;
}
```

---

### Response
```ts
interface UnitTypeResponse {
  status: number;
  message: string;
  data: UnitType[];
}
```

---

## 🛡️ Error Handling

### Successful Retrieval
- Returns 200 OK
- Returns list of unit types

### Unauthorized
- Missing/invalid JWT
- Returns 401

### Empty Dataset
- Returns empty array

---

## 🗄️ Database Schema

```sql
CREATE TABLE tblunit_types (
  unit_type_id SERIAL PRIMARY KEY,
  unit_type_name VARCHAR(255),
  unit_type_descr TEXT,
  is_active BOOLEAN
);
```

---

### Query
```sql
SELECT unit_type_id, unit_type_name, unit_type_descr, is_active
FROM tblunit_types;
```

---

## 🧪 Testing

```bash
curl -H "Authorization: Bearer YOUR_TOKEN"      http://localhost:8080/api/unit-types
```

---

## 🔄 Production Notes

- Use caching (rare changes)
- Add rate limiting
- Ensure JWT validation

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Check token
- Refresh token

### Empty Data
- Verify DB has data

### 500 Error
- Check logs
- Check DB connection

---

## 📞 Support

1. Verify JWT
2. Check backend logs
3. Test SQL directly

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Backend:** DX Organization Management Backend  
