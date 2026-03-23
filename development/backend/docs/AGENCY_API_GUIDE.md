# 🏢 Agency API Guide

## Overview
The Agency API provides endpoints for retrieving agency information grouped by sectors. This API is specifically designed for dropdown/select UI components in project management and reporting systems. All endpoints require JWT authentication.

## 🎯 User Story
**As a project manager or report analyst, I want to select an agency from a dropdown list that is organized into logical sectors (e.g., Sectoral Planning Councils, R&D Institutes), so that I can quickly and accurately find the correct agency without searching through a long, flat list.**

## 🔐 Authentication
All Agency API endpoints require JWT authentication. See [JWT_TOKEN_GUIDE.md](./JWT_TOKEN_GUIDE.md) for detailed authentication setup.

### Required Header
```http
Authorization: Bearer YOUR_JWT_TOKEN
Accept: application/json
```

## 📡 API Endpoints

### Get Agencies by Sector
Retrieves all agencies grouped by their respective sectors, formatted for dropdown/select UI components.

```http
GET /api/agencies/by-sector/list
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Accept: application/json
```

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Agency dropdown list retrieved successfully.",
  "data": [
    {
      "org_unit_id": 101,
      "org_unit_name": "Sectoral Planning Councils",
      "agencies": [
        {
          "org_unit_id": 102,
          "org_unit_name": "PCAARRD",
          "parent_org_unit_id": 101
        },
        {
          "org_unit_id": 103,
          "org_unit_name": "PCHRD",
          "parent_org_unit_id": 101
        },
        {
          "org_unit_id": 104,
          "org_unit_name": "PCIEERD",
          "parent_org_unit_id": 101
        }
      ]
    },
    {
      "org_unit_id": 153,
      "org_unit_name": "Research And Development Institutes",
      "agencies": [
        {
          "org_unit_id": 139,
          "org_unit_name": "ASTI",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 140,
          "org_unit_name": "FNRI",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 141,
          "org_unit_name": "FPRDI",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 142,
          "org_unit_name": "ITDI",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 143,
          "org_unit_name": "MIRDC",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 144,
          "org_unit_name": "PNRI",
          "parent_org_unit_id": 153
        },
        {
          "org_unit_id": 145,
          "org_unit_name": "PTRI",
          "parent_org_unit_id": 153
        }
      ]
    },
    {
      "org_unit_id": 155,
      "org_unit_name": "Scientific and Technological Services",
      "agencies": [
        {
          "org_unit_id": 146,
          "org_unit_name": "PAGASA",
          "parent_org_unit_id": 155
        },
        {
          "org_unit_id": 147,
          "org_unit_name": "PHIVOLCS",
          "parent_org_unit_id": 155
        },
        {
          "org_unit_id": 154,
          "org_unit_name": "SEI",
          "parent_org_unit_id": 155
        },
        {
          "org_unit_id": 150,
          "org_unit_name": "Philippine Science High School System",
          "parent_org_unit_id": 155
        },
        {
          "org_unit_id": 148,
          "org_unit_name": "STII",
          "parent_org_unit_id": 155
        },
        {
          "org_unit_id": 152,
          "org_unit_name": "TAPI",
          "parent_org_unit_id": 155
        }
      ]
    },
    {
      "org_unit_id": 157,
      "org_unit_name": "Collegial and Scientific Bodies",
      "agencies": [
        {
          "org_unit_id": 156,
          "org_unit_name": "NAST",
          "parent_org_unit_id": 157
        },
        {
          "org_unit_id": 149,
          "org_unit_name": "NRCP",
          "parent_org_unit_id": 157
        }
      ]
    }
  ]
}
```

**Response (Success - 200, No Data):**
```json
{
  "status": 200,
  "message": "No agencies found.",
  "data": []
}
```

**Response (Error - 401):**
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

**Response (Error - 500):**
```json
{
  "status": 500,
  "message": "Internal server error",
  "data": {}
}
```

## 🔧 Usage Examples

### Using with curl
```bash
# First get your JWT token
TOKEN=$(curl -s http://localhost:3000/api/auth/token | jq -r '.data.token')

# Get agencies by sector
curl -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/json" \
     http://localhost:3000/api/agencies/by-sector/list
```

### Using with Postman
1. **Set Authorization:**
   - Type: Bearer Token
   - Token: Your JWT token from `/api/auth/token`

2. **Request:**
   - Method: GET
   - URL: `http://localhost:3000/api/agencies/by-sector/list`
   - Headers: 
     - `Authorization: Bearer YOUR_TOKEN`
     - `Accept: application/json`

### Using with JavaScript/TypeScript
```javascript
// Get JWT token first
async function getToken() {
  const response = await fetch('http://localhost:3000/api/auth/token');
  const data = await response.json();
  return data.data.token;
}

// Get agencies by sector
async function getAgenciesBySector() {
  const token = await getToken();
  
  const response = await fetch('http://localhost:3000/api/agencies/by-sector/list', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// Usage
getAgenciesBySector()
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));
```

### Using with React (Dropdown Component)
```jsx
import React, { useState, useEffect } from 'react';

function AgencyDropdown() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        // Get token first
        const tokenResponse = await fetch('http://localhost:3000/api/auth/token');
        const tokenData = await tokenResponse.json();
        const token = tokenData.data.token;

        // Get agencies
        const agenciesResponse = await fetch('http://localhost:3000/api/agencies/by-sector/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const agenciesData = await agenciesResponse.json();
        setSectors(agenciesData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  if (loading) return <div>Loading agencies...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select>
      <option value="">Select an agency...</option>
      {sectors.map(sector => (
        <optgroup key={sector.org_unit_id} label={sector.org_unit_name}>
          {sector.agencies.map(agency => (
            <option key={agency.org_unit_id} value={agency.org_unit_id}>
              {agency.org_unit_name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default AgencyDropdown;
```

## 📊 Data Structure

### Agency Object
```typescript
interface Agency {
  org_unit_id: number;
  org_unit_name: string;
  parent_org_unit_id: number;
}
```

### Sector Group Object
```typescript
interface SectorGroup {
  org_unit_id: number;
  org_unit_name: string;
  agencies: Agency[];
}
```

### Response Structure
```typescript
interface AgencyResponse {
  status: number;
  message: string;
  data: SectorGroup[];
}
```

## 🎯 Expected Sector Categories

Based on the user story requirements, the API should return these specific sectors:

### 1. Sectoral Planning Councils
- PCAARRD (Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development)
- PCHRD (Philippine Council for Health Research and Development)
- PCIEERD (Philippine Council for Industry, Energy and Emerging Technology Research and Development)

### 2. Research And Development Institutes
- ASTI (Advanced Science and Technology Institute)
- FNRI (Food and Nutrition Research Institute)
- FPRDI (Forest Products Research and Development Institute)
- ITDI (Industrial Technology Development Institute)
- MIRDC (Metals Industry Research and Development Center)
- PNRI (Philippine Nuclear Research Institute)
- PTRI (Philippine Textile Research Institute)

### 3. Scientific and Technological Services
- PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration)
- PHIVOLCS (Philippine Institute of Volcanology and Seismology)
- SEI (Science Education Institute)
- Philippine Science High School System
- STII (Science and Technology Information Institute)
- TAPI (Technology Application and Promotion Institute)

### 4. Collegial and Scientific Bodies
- NAST (National Academy of Science and Technology)
- NRCP (National Research Council of the Philippines)

## 🛡️ Error Handling

### Acceptance Criteria Compliance

#### ✅ Successful Data Retrieval
- **Given:** User is authenticated with valid JWT
- **When:** GET request to `/api/agencies/by-sector/list`
- **Then:** Returns HTTP 200 OK with categorized agencies

#### ✅ Unauthorized Access
- **Given:** User is not authenticated or has invalid JWT
- **When:** GET request to `/api/agencies/by-sector/list`
- **Then:** Returns HTTP 401 Unauthorized

#### ✅ Data Integrity
- **Given:** `tblorganizational_units` table is populated
- **When:** API is called
- **Then:** Correctly groups agencies under parent categories using database parent records

### Common HTTP Status Codes

#### 200 OK
- Request successful
- Data returned in required format (or empty array with message `No agencies found.`)

#### 401 Unauthorized
- Missing or invalid JWT token
- Token expired
- Solution: Get new token from `/api/auth/login`

#### 500 Internal Server Error
- Database connection issues
- Server-side errors
- Solution: Check server logs

## 🗄️ Database Schema

### Table: tblorganizational_units
```sql
CREATE TABLE tblorganizational_units (
  org_unit_id SERIAL PRIMARY KEY,
  org_unit_name VARCHAR(255) NOT NULL,
  parent_org_unit_id INTEGER REFERENCES tblorganizational_units(org_unit_id),
  unit_type_id INTEGER NOT NULL
);
```

### Query Used
```sql
SELECT
  child.org_unit_id,
  child.org_unit_name,
  child.parent_org_unit_id,
  parent.org_unit_name AS sector_name
FROM
  tblorganizational_units child
INNER JOIN
  tblorganizational_units parent ON parent.org_unit_id = child.parent_org_unit_id
WHERE
  child.unit_type_id = 1
  AND child.parent_org_unit_id IN (101, 153, 155, 157)
ORDER BY
  child.parent_org_unit_id, child.org_unit_name;
```

The API derives sector labels from `parent.org_unit_name` instead of hardcoded constants.

## 🧪 Testing

### Acceptance Testing
```bash
# Test successful retrieval
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     http://localhost:3000/api/agencies/by-sector/list

# Expected: 200 OK with 4 sector categories
```

### Unit Testing Example
```javascript
describe('Agency API - Acceptance Criteria', () => {
  test('should return agencies grouped by sector', async () => {
    const token = await getTestToken();
    const response = await request(app)
      .get('/api/agencies/by-sector/list')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe('Agency dropdown list retrieved successfully.');
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Check Sectoral Planning Councils
    const sectoralCouncils = response.body.data.find(s => s.org_unit_name === "Sectoral Planning Councils");
    expect(sectoralCouncils.agencies).toHaveLength(3);
    expect(sectoralCouncils.agencies.map(a => a.org_unit_name)).toContain("PCAARRD");
    expect(sectoralCouncils.agencies.map(a => a.org_unit_name)).toContain("PCHRD");
    expect(sectoralCouncils.agencies.map(a => a.org_unit_name)).toContain("PCIEERD");
  });

  test('should return 401 for unauthorized access', async () => {
    await request(app)
      .get('/api/agencies/by-sector/list')
      .expect(401);
  });
});
```

## 🔄 Production Considerations

### Performance
- Lightweight data retrieval optimized for dropdowns
- Consider caching for 24 hours (agency data changes infrequently)
- Database indexes on `parent_org_unit_id` and `unit_type_id`

### Security
- JWT authentication required
- Rate limiting recommended for production
- Input validation on all parameters

### Scalability
- Pagination not needed (small dataset)
- CDN caching for API responses
- Monitor API usage patterns

## 🐛 Troubleshooting

### Common Issues

#### 401 Unauthorized
**Problem:** Invalid or missing token
**Solution:** 
1. Get fresh token from `/api/auth/token`
2. Check Authorization header format
3. Verify token hasn't expired

#### Wrong Sector Grouping
**Problem:** Agencies not grouped correctly
**Solution:**
1. Check `parent_org_unit_id` values in database
2. Verify `unit_type_id = 1` filter and parent IDs `(101, 153, 155, 157)`
3. Verify parent records exist for those IDs

#### Empty Response
**Problem:** No agencies returned
**Solution:**
1. Check database connection
2. Verify agency rows exist with `unit_type_id = 1` and `parent_org_unit_id` in `(101, 153, 155, 157)`
3. Check server logs for errors

### Debug Steps
1. Check JWT token validity
2. Verify database connection
3. Check server console logs
4. Test SQL query directly
5. Monitor network requests

## 📞 Support

For Agency API issues:
1. Check JWT authentication first
2. Verify server is running
3. Check database connectivity
4. Review server logs
5. Test with curl/Postman

---

**Related Documentation:**
- [JWT Token Guide](./JWT_TOKEN_GUIDE.md)
- [API Authentication](./AUTH_GUIDE.md)

**Last Updated:** March 23, 2026  
**Version:** 1.1.0  
**Backend:** DX Organization Management Backend  
**Compliance:** ✅ Meets all user story acceptance criteria
