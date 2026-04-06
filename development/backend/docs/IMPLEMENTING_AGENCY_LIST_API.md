# Implementing Agency List API Documentation

## Quick Reference

**API Endpoint:** `GET /api/implementing-agency/unit-type`  
**Authentication:** Bearer JWT Token (Required)  
**Status:** ✅ Production Ready | Tests: 12/12 Pass | Coverage: 92.3%  
**Last Updated:** April 6, 2026

---

## Overview

The **Implementing Agency List API** retrieves organizational units filtered by unit type identifiers. Supports flexible filtering by single or multiple types, with JWT authentication and input validation.

**Key Features:**
- Secure JWT authentication
- Comma-separated multi-type filtering
- Consistent response formatting
- Real database records (no mock data)
- Input validation with error handling

---

## API Endpoint Specification

### Request

```http
GET /api/implementing-agency/unit-type?unit_types=1,2 HTTP/1.1
Host: api.dost.gov.ph
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

### Query Parameter

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `unit_types` | string | No | 1 | Comma-separated integers (e.g., `1,2,3`). Spaces trimmed automatically. |

**Validation:** Positive integers only. Non-numeric values trigger HTTP 400.

**Examples:**
- `?unit_types=1` → Type 1 only
- `?unit_types=1,2` → Types 1 or 2
- `?unit_types=1, 2, 3` → Types 1, 2, 3 (spaces trimmed)
- No parameter → Defaults to type 1

---

## Response Format

### Success (HTTP 200)

**With Data:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 102, "org_unit_name": "PCAARRD" },
    { "org_unit_id": 103, "org_unit_name": "PCHRD" }
  ]
}
```

**Empty Result:**
```json
{
  "status": 200,
  "message": "No implementing agencies found.",
  "data": []
}
```

### Error Responses

**HTTP 400 (Bad Request):**
```json
{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

**HTTP 401 (Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

**HTTP 500 (Server Error):**
```json
{
  "status": 500,
  "message": "Internal server error",
  "errors": { "detail": "Error details" }
}
```

---

## Error Handling

| Status | Cause | Solution |
|--------|-------|----------|
| **200** | Success (data or empty) | Parse `data` array |
| **400** | Invalid parameters | Use only digits/commas: `?unit_types=1,2` |
| **401** | Missing/invalid token | Provide valid JWT in Authorization header |
| **500** | Database/server error | Check DB connection and logs |

---

## Authentication

**Required:** Yes (Bearer Token / JWT)

```
Authorization: Bearer <valid_jwt_token>
```

**Token Requirements:**
- Type: JWT (JSON Web Token)
- Algorithm: HS256
- Validity checked on every request
- Invalid/expired tokens return HTTP 401

---

## Usage Examples

### cURL

```bash
# Default (unit_type = 1)
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Single filter (unit_type = 2)
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type?unit_types=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Multiple filters
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type?unit_types=1,2,3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch

```javascript
async function getAgencies(unitTypes = null) {
  const url = new URL('http://localhost:3000/api/implementing-agency/unit-type');
  if (unitTypes) url.searchParams.append('unit_types', unitTypes);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.data; // Return agencies array
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Usage
const agencies = await getAgencies();        // Default
const regional = await getAgencies('2');     // Regional offices
const combined = await getAgencies('1,2');   // Both types
```

### Python

```python
import requests

def get_agencies(unit_types=None):
    url = 'http://localhost:3000/api/implementing-agency/unit-type'
    headers = {
        'Authorization': f'Bearer {jwt_token}',
        'Accept': 'application/json'
    }
    params = {'unit_types': unit_types} if unit_types else {}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json().get('data', [])
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return []

# Usage
agencies = get_agencies()          # All agencies
offices = get_agencies('2')        # Regional offices
```

---

## Testing with Postman

### Setup

1. **Method:** GET
2. **URL:** `http://localhost:8000/api/implementing-agency/unit-type`
3. **Authorization:**
   - Type: Bearer Token
   - Token: `<your_jwt_token>`
4. **Headers:**
   - Accept: application/json

### Test Cases

| Case | URL | Status | Notes |
|------|-----|--------|-------|
| Default | `base_url/api/implementing-agency/unit-type` | 200 | Returns agencies |
| Single filter | `base_url/api/implementing-agency/unit-type?unit_types=2` | 200 | Regional offices |
| Multiple | `base_url/api/implementing-agency/unit-type?unit_types=1,2` | 200 | Both types |
| Invalid param | `base_url/api/implementing-agency/unit-type?unit_types=abc` | 400 | Bad Request |
| No token | `base_url/api/implementing-agency/unit-type` | 401 | Unauthorized |
| Empty result | `base_url/api/implementing-agency/unit-type?unit_types=999` | 200 | Returns `[]` |

### Postman Tests Script

```javascript
// Test 1: Status 200
pm.test('Response OK', () => pm.response.to.have.status(200));

// Test 2: Has required fields
pm.test('Response structure', () => {
  const data = pm.response.json();
  pm.expect(data).to.have.property('status');
  pm.expect(data).to.have.property('message');
  pm.expect(data).to.have.property('data');
});

// Test 3: Data is array
pm.test('Data is array', () => {
  pm.expect(pm.response.json().data).to.be.an('array');
});

// Test 4: Response time < 500ms
pm.test('Performance', () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

## Common Issues & Troubleshooting

### HTTP 401 Unauthorized

**Problem:** Response: `{ "status": 401, "message": "Unauthorized" }`

**Root Causes & Fixes:**
| Issue | Fix |
|-------|-----|
| Missing `Authorization` header | Add header: `Authorization: Bearer <token>` |
| Expired JWT token | Refresh token from auth service |
| Malformed token | Verify format: `Bearer eyJ...` (no extra spaces) |
| JWT_SECRET mismatch | Check environment variable matches auth service |

### HTTP 400 Bad Request

**Problem:** Response: `{ "status": 400, "message": "Invalid unit_types parameter..." }`

**Root Causes & Fixes:**
| Issue | Fix |
|-------|-----|
| Non-numeric characters | Use only digits/commas: `?unit_types=1,2,3` |
| Special characters | Remove spaces/symbols except commas |
| Negative numbers | Use positive integers only |
| Decimals | Use integers, not floats |

### HTTP 500 Server Error

**Problem:** Response: `{ "status": 500, "message": "Internal server error" }`

**Root Causes & Fixes:**
| Issue | Fix |
|-------|-----|
| Database connection failed | Check DB credentials in .env |
| Table doesn't exist | Verify `tblorganizational_units` is created |
| Missing environment variables | Check `JWT_SECRET`, `DATABASE_URL` in .env |

**Debug Steps:**
```bash
# Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# Test database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tblorganizational_units;"

# View server logs
npm run dev
```

### Empty Result (No Data)

**Problem:** Response: `{ "status": 200, "message": "No implementing agencies found.", "data": [] }`

**Root Causes & Fixes:**
| Issue | Fix |
|-------|-----|
| Invalid unit_type_id | Verify unit_type exists: `SELECT DISTINCT unit_type_id FROM tblorganizational_units;` |
| parent_org_unit_id = NULL | API filters out top-level organizations |
| Data not loaded | Check database has been populated |

---

## Testing

### Running Tests

```bash
# Run implementing agency tests
npm test -- implementingAgency.test.ts

# Verbose output
npm test -- implementingAgency.test.ts --verbose

# With coverage report
npm test -- implementingAgency.test.ts --coverage
```

### Test Results

```
✅ PASS test/implementingAgency.test.ts
Tests: 12 passed, 12 total
Coverage: 92.3% statements, 75% branches, 100% functions
```

**Test Coverage:**
- ✓ Default retrieval (unit_types=1)
- ✓ Single filter (unit_types=2)
- ✓ Multiple filters (unit_types=1,2)
- ✓ Unauthorized access (missing/invalid token)
- ✓ Empty result set (no matching records)
- ✓ Invalid parameters (non-numeric)
- ✓ Parameter parsing (comma-separated, spaces)

---

## Architecture

### Request Flow

```
Request → JWT Middleware → Controller → Validation → 
Use Case → Repository → Database → Mapper → Response
```

### Components

| Component | File | Purpose |
|-----------|------|---------|
| **Routes** | `implementingAgencyRoutes.ts` | HTTP route definition |
| **Controller** | `implementingAgencyController.ts` | Request/response handling |
| **Use Case** | `getImplementingAgenciesByUnitTypeUseCase.ts` | Business logic |
| **Repository** | `implementingAgencyRepositoryImp.ts` | Database queries |
| **Mapper** | `implementingAgencyMapper.ts` | Model conversion |
| **Entity** | `implementingAgencyEntity.ts` | Domain model |
| **Middleware** | `authMiddleware.ts` | JWT validation |

---

## Performance & Limits

| Metric | Value |
|--------|-------|
| Average Response Time | < 100ms |
| Max Query Parameters | No limit |
| Concurrent Requests | Limited by server |
| Request Timeout | 30 seconds |
| Indexed Columns | `unit_type_id` |
| Database Strategy | PostgreSQL `ANY()` operator |

**Recommendations:**
- Keep `unit_types` ≤ 10 values
- Cache results on client-side
- Monitor query performance if dataset grows

---

## Document Status

| Property | Value |
|----------|-------|
| **Version** | 1.0 |
| **Last Updated** | April 6, 2026 |
| **Status** | ✅ Production Ready |
| **Tests** | ✅ 12/12 Pass |
| **Coverage** | ✅ 92.3% |
| **Auth** | ✅ JWT Bearer Token |
| **Postman** | ✅ Verified |

**Current State:**
- ✅ API Implemented at `/api/implementing-agency/unit-type`
- ✅ Database Connected & Returning Real Data
- ✅ All Tests Passing
- ✅ Documentation Complete
- ✅ Ready for Production

---

**End of Documentation**
