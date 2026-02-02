# Organizational Unit List API

## Overview
This API endpoint provides a comprehensive list of all organizational units within the DOST organizational structure, including parent-child relationships and complete address information combining internal data with external geo-location services.

## Endpoint
**GET** `/api/organizational-units`

## Authentication
Requires JWT authentication via `Authorization: Bearer <token>` header.

### Success Response (200 OK)
```json
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "org_unit_id": 105,
      "org_unit_name": "Department of Science and Technology",
      "parent_unit_name": null,
      "unit_type": "Agency",
      "complete_address": "NCR, Metro Manila, Taguig City, Bicutan, DOST Complex, General Santos Ave."
    },
    {
      "org_unit_id": 106,
      "org_unit_name": "OFFICE OF THE SECRETARY",
      "parent_unit_name": "Department of Science and Technology",
      "unit_type": "Office",
      "complete_address": "NCR, Metro Manila, Taguig City, Bicutan, DOST Complex, General Santos Ave."
    },
    {
      "org_unit_id": 107,
      "org_unit_name": "OFFICE OF THE UNDERSECRETARY FOR SCIENTIFIC AND TECHNICAL SERVICES",
      "parent_unit_name": "Department of Science and Technology",
      "unit_type": "Office",
      "complete_address": "NCR, Metro Manila, Taguig City, Bicutan, DOST Complex, General Santos Ave."
    }
  ]
}
```

### Success Response - Empty Data (200 OK)
```json
{
  "status": 200,
  "message": "success",
  "data": []
}
```

### Error Response (401 Unauthorized - Missing Header)
```json
{
  "status": 401,
  "message": "Authorization header missing",
  "data": {}
}
```

### Error Response (401 Unauthorized - Invalid Token)
```json
{
  "status": 401,
  "message": "Invalid token",
  "data": {}
}
```

### Error Response (401 Unauthorized - Expired Token)
```json
{
  "status": 401,
  "message": "Token expired",
  "data": {}
}
```

### Error Response (500 Internal Server Error)
```json
{
  "status": 500,
  "message": "Internal server error",
  "data": {}
}
```

## Response Fields

### OrganizationalUnit Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `org_unit_id` | integer | Yes | Unique identifier for the organizational unit |
| `org_unit_name` | string | Yes | Official name of the organizational unit |
| `parent_unit_name` | string \| null | Yes | Name of the parent organizational unit. `null` for top-level units (e.g., Department of Science and Technology) |
| `unit_type` | string | Yes | Type of organizational unit (e.g., "Agency", "Office", "Division", "Section") |
| `complete_address` | string | Yes | Full formatted address including region, province, city, barangay, and street address. Format: "Region, Province, City, Barangay, Street Address" |

## Address Format
The `complete_address` field follows this hierarchical format:
```
<Region>, <Province>, <City>, <Barangay>, <Street Address>
```

**Example:**
```
NCR, Metro Manila, Taguig City, Bicutan, DOST Complex, General Santos Ave.
```

**Notes:**
- Address components are comma-separated
- Missing components are omitted (no empty values between commas)
- Geographic data (Region, Province, City, Barangay) is fetched from the Geo Data Services microservice
- Street address is stored in the organizational units database

## Database Schema

### Tables Used

#### Primary Table: `tblorganizational_units`
| Column | Type | Description |
|--------|------|-------------|
| `org_unit_id` | SERIAL PRIMARY KEY | Unique identifier |
| `org_unit_name` | VARCHAR(255) NOT NULL | Name of the unit |
| `parent_org_unit_id` | INTEGER | Foreign key to parent unit (self-reference) |
| `unit_type_id` | INTEGER | Foreign key to unit type |
| `address` | VARCHAR(500) | Street address |
| `brgy_id` | INTEGER | Foreign key to barangay in Geo Data Service |
| `city_id` | INTEGER | Foreign key to city in Geo Data Service |
| `prov_id` | INTEGER | Foreign key to province in Geo Data Service |
| `region_id` | INTEGER | Foreign key to region in Geo Data Service |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

#### Reference Table: `tblunit_types`
| Column | Type | Description |
|--------|------|-------------|
| `unit_type_id` | SERIAL PRIMARY KEY | Unique identifier |
| `unit_type_name` | VARCHAR(100) NOT NULL | Type name (e.g., "Agency", "Office") |

### SQL Query
```sql
SELECT
  ou.org_unit_id,
  ou.org_unit_name,
  ou.address,
  ou.brgy_id,
  ou.city_id,
  ou.prov_id,
  ou.region_id,
  ut.unit_type_name AS unit_type,
  parent.org_unit_name AS parent_unit_name
FROM
  tblorganizational_units AS ou
LEFT JOIN
  tblunit_types AS ut ON ou.unit_type_id = ut.unit_type_id
LEFT JOIN
  tblorganizational_units AS parent ON ou.parent_org_unit_id = parent.org_unit_id
ORDER BY ou.org_unit_id;
```

## Implementation Details

### Architecture
The implementation follows Clean Architecture principles with the following layers:

#### 1. **Domain Layer** (`src/domain/`)
- **Entities**
  - `OrganizationalUnitEntity.ts` - Core business entity representing an organizational unit
  
- **Repositories** (Interfaces)
  - `OrganizationalUnitRepository.ts` - Repository contract defining data access methods
  
- **Use Cases**
  - `GetAllOrganizationalUnitsUseCase.ts` - Business logic for retrieving organizational units

#### 2. **Data Layer** (`src/data/`)
- **Repository Implementations**
  - `OrganizationalUnitRepositoryImp.ts` - Concrete implementation of repository interface
    - Queries PostgreSQL database
    - Makes parallel API calls to Geo Data Services for location names
    - Constructs complete addresses
    - Handles mock data mode for testing

#### 3. **Presentation Layer** (`src/presentation/`)
- **Controllers**
  - `OrganizationalUnitController.ts` - Handles HTTP requests and responses
  
- **DTOs** (Data Transfer Objects)
  - `OrganizationalUnitDto.ts` - Defines response structure
  
- **Routes**
  - `OrganizationalUnitRoutes.ts` - Route definitions and middleware configuration
  
- **Middleware**
  - `authMiddleware.ts` - JWT authentication middleware

### Dependency Injection
All components are registered in the DI container using InversifyJS

## External Dependencies

### Geo Data Services Microservice
The API integrates with an external Geo Data Services microservice to resolve location names:

**Base URL:** Configured via `GEO_SERVICE_URL` environment variable

**Endpoints Called:**
- `GET /api/region/{region_id}` - Returns region name
- `GET /api/province/{prov_id}` - Returns province name
- `GET /api/city/{city_id}` - Returns city/municipality name
- `GET /api/barangay/{brgy_id}` - Returns barangay name

**Request Pattern:**
```typescript
const response = await fetch(`${GEO_SERVICE_URL}/region/${region_id}`);
const data = await response.json();
// Expected: { id: 1, name: "NCR" }
```

### Mock Data Mode
When `USE_MOCK_GEO_DATA=true`, the API uses predefined location data instead of calling the external service:

**Available Mock Data:**
- **Regions:** NCR, CAR, Region I-XIII
- **Provinces:** Metro Manila, Iloilo, Cebu, Davao del Sur
- **Cities:** Taguig City, Iloilo City, Cebu City, Davao City
- **Barangays:** Bicutan, City Proper, Poblacion

## Testing

### Test Suite
Comprehensive tests are located in `src/test/OrganizationalUnitListTest.ts` covering:

#### Authentication Tests (5 tests)
- ✅ No authorization header → 401
- ✅ Malformed authorization → 401
- ✅ Missing token → 401
- ✅ Invalid token → 401
- ✅ Expired token → 401

#### Successful Response Tests (3 tests)
- ✅ Valid JWT returns 200
- ✅ Returns array of organizational units
- ✅ Empty data returns empty array

#### Response Structure Tests (4 tests)
- ✅ Required fields present
- ✅ Top-level units have null parent_unit_name
- ✅ Child units have non-null parent_unit_name
- ✅ complete_address is a string

#### Response Format Tests (2 tests)
- ✅ Follows GlobalResponseDto structure
- ✅ Content-Type is application/json

#### Data Integrity Tests (3 tests)
- ✅ org_unit_id is unique
- ✅ org_unit_name is non-empty
- ✅ unit_type is valid

#### Edge Cases Tests (5 tests)
- ✅ Additional headers handled gracefully
- ✅ Query parameters ignored
- ✅ POST/PUT/DELETE methods rejected

**Total:** 22 comprehensive tests

## Usage Examples

### cURL
```bash
# Request organizational units
curl -X GET http://localhost:8080/api/organizational-units \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json"
```

### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:8080/api/organizational-units', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const result = await response.json();
console.log(`Total units: ${result.data.length}`);

// Find top-level units
const topLevelUnits = result.data.filter(unit => unit.parent_unit_name === null);
console.log('Top-level units:', topLevelUnits);

// Find children of a specific unit
const parentName = "Department of Science and Technology";
const children = result.data.filter(unit => unit.parent_unit_name === parentName);
console.log(`Children of ${parentName}:`, children);
```

## Data Integrity

### Validation Rules
- ✅ All `org_unit_id` values are unique
- ✅ All `org_unit_name` values are non-empty
- ✅ `parent_unit_name` is `null` for top-level units only
- ✅ Parent-child relationships are consistent (no circular references)
- ✅ All units have valid `unit_type` values
- ✅ `complete_address` is always a string (may be empty if no location data)

### Data Consistency
- Parent organizational units must exist before child units can reference them
- Unit type must exist in `tblunit_types` before assignment
- Foreign key constraints ensure referential integrity
- Location IDs reference external Geo Data Service (no FK constraints)

## Error Handling

### Client Errors (4xx)
| Status | Cause | Solution |
|--------|-------|----------|
| 401 | No Authorization header | Add `Authorization: Bearer <token>` header |
| 401 | Invalid token | Generate new JWT token |
| 401 | Expired token | Refresh or regenerate JWT token |
| 404 | Wrong endpoint | Verify URL is `/api/organizational-units` |

### Server Errors (5xx)
| Status | Cause | Solution |
|--------|-------|----------|
| 500 | Database connection failed | Check database credentials and connectivity |
| 500 | SQL query error | Verify database schema matches expectations |
| 500 | Geo service unavailable | Enable mock data mode or fix geo service |

### Logging
All errors are logged to console with detailed information:
- Error type and message
- Stack trace
- Request context (when available)

## Version History

### Version 1.0.0 (Current)
- ✅ Initial implementation
- ✅ JWT authentication
- ✅ Full organizational unit listing
- ✅ Parent-child relationships
- ✅ Complete address construction with geo service integration
- ✅ Mock data mode for testing
- ✅ Comprehensive test suite (22 tests)
- ✅ Clean architecture implementation

### Contact
For issues, questions, or contributions, please contact the DOST DX development team.

---

**Last Updated:** February 2, 2026  
**Maintained By:** DOST DX Organization Management Team  
**License:** Internal Use Only