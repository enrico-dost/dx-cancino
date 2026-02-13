# Update Organizational Unit API

## Overview
This API endpoint allows system administrators to update the details of an existing organizational unit, such as its name, description, parent unit, and location information. The API supports partial updates, allowing administrators to modify one or more fields while preserving unchanged data.

## Endpoint
**PUT** `/api/organizational-units/{org_unit_id}`

## Authentication
Requires JWT authentication via `Authorization: Bearer <token>` header.

## Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `org_unit_id` | integer | Yes | The unique ID of the organizational unit to be updated |

## Request Body Parameters
All parameters are optional. Only the fields provided will be updated. At least one field must be provided.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `org_unit_name` | string | No | The new name for the organizational unit |
| `org_unit_descr` | string | No | The new description for the unit |
| `unit_type_id` | integer | No | The new unit type ID |
| `parent_org_unit_id` | integer | No | The ID of the new parent unit |
| `region_id` | integer | No | The new region ID |
| `prov_id` | integer | No | The new province ID |
| `city_id` | integer | No | The new city ID |
| `brgy_id` | integer | No | The new barangay ID |
| `address` | string | No | The new street address |
| `latitude` | string | No | The new latitude coordinate |
| `longitude` | string | No | The new longitude coordinate |

## Example Requests

### Update Single Field
```json
PUT /api/organizational-units/105
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "org_unit_name": "Department of Science and Technology - Updated"
}
```

### Update Multiple Fields
```json
PUT /api/organizational-units/105
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "org_unit_name": "Department of Science and Technology",
  "org_unit_descr": "National research and development agency",
  "address": "DOST Complex, General Santos Ave., Bicutan, Taguig City"
}
```

## Responses

### Success Response (200 OK)
Returns the complete, updated organizational unit object with all current values from the database.

```json
{
  "org_unit_id": 105,
  "org_unit_name": "Department of Science and Technology",
  "parent_unit_name": null,
  "unit_type": "Agency",
  "complete_address": "DOST Complex, General Santos Ave."
}
```

### Error Response (404 Not Found - Invalid org_unit_id)
```json
{
  "status": 404,
  "message": "Organizational unit not found",
  "data": {}
}
```

### Error Response (401 Unauthorized - No Token)
```json
{
  "status": 401,
  "message": "unauthorized",
  "data": {}
}
```

### Error Response (401 Unauthorized - Invalid Token)
```json
{
  "status": 401,
  "message": "unauthorized",
  "data": {}
}
```

### Error Response (400 Bad Request - Invalid parent_org_unit_id)
```json
{
  "status": 400,
  "message": "Invalid parent_org_unit_id: Parent unit does not exist",
  "data": {}
}
```

### Error Response (400 Bad Request - Invalid Data Type)
```json
{
  "status": 400,
  "message": "Invalid unit_type_id: must be a valid integer",
  "data": {}
}
```

### Error Response (400 Bad Request - Missing org_unit_id)
```json
{
  "status": 400,
  "message": "Invalid org_unit_id: must be a valid integer",
  "data": {}
}
```

### Error Response (400 Bad Request - No Update Data)
```json
{
  "status": 400,
  "message": "No update data provided",
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
| `parent_unit_name` | string \| null | Yes | Name of the parent organizational unit. `null` for top-level units |
| `unit_type` | string | Yes | Type of organizational unit (e.g., "Agency", "Office", "Division") |
| `complete_address` | string | Yes | Full formatted address. Format may vary based on available location data |

## Database Schema

### Primary Table: `tblorganizational_units`
| Column | Type | Description |
|--------|------|-------------|
| `org_unit_id` | SERIAL PRIMARY KEY | Unique identifier |
| `org_unit_name` | VARCHAR(255) NOT NULL | Name of the unit |
| `org_unit_descr` | TEXT | Description of the unit |
| `parent_org_unit_id` | INTEGER | Foreign key to parent unit (self-reference) |
| `unit_type_id` | INTEGER | Foreign key to unit type |
| `region_id` | INTEGER | Foreign key to region |
| `prov_id` | INTEGER | Foreign key to province |
| `city_id` | INTEGER | Foreign key to city |
| `brgy_id` | INTEGER | Foreign key to barangay |
| `address` | VARCHAR(500) | Street address |
| `latitude` | VARCHAR(50) | Latitude coordinate |
| `longitude` | VARCHAR(50) | Longitude coordinate |
| `created_by` | INTEGER | User who created the record |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_by` | INTEGER | User who last updated the record |
| `updated_at` | TIMESTAMP | Record update timestamp |

### Reference Table: `tblunit_types`
| Column | Type | Description |
|--------|------|-------------|
| `unit_type_id` | SERIAL PRIMARY KEY | Unique identifier |
| `unit_type_name` | VARCHAR(100) NOT NULL | Type name (e.g., "Agency", "Office") |

### SQL Query
```sql
-- Dynamic UPDATE query (only updates provided fields)
UPDATE tblorganizational_units
SET
    org_unit_name = $1,          -- Only if provided
    org_unit_descr = $2,         -- Only if provided
    unit_type_id = $3,           -- Only if provided
    parent_org_unit_id = $4,     -- Only if provided
    region_id = $5,              -- Only if provided
    prov_id = $6,                -- Only if provided
    city_id = $7,                -- Only if provided
    brgy_id = $8,                -- Only if provided
    address = $9,                -- Only if provided
    latitude = $10,              -- Only if provided
    longitude = $11,             -- Only if provided
    updated_by = $12,            -- Always updated
    updated_at = CURRENT_TIMESTAMP  -- Always updated
WHERE
    org_unit_id = $13
RETURNING org_unit_id;

-- Retrieve updated record with relationships
SELECT
  ou.org_unit_id,
  ou.org_unit_name,
  parent_ou.org_unit_name as parent_unit_name,
  ut.unit_type_name,
  ou.address
FROM
  tblorganizational_units ou
LEFT JOIN tblorganizational_units parent_ou ON ou.parent_org_unit_id = parent_ou.org_unit_id
LEFT JOIN tblunit_types ut ON ou.unit_type_id = ut.unit_type_id
WHERE
  ou.org_unit_id = $1;
```

## Implementation Details

### Architecture
The implementation follows Clean Architecture principles with the following layers:

#### 1. **Domain Layer** (`src/domain/`)
- **Entities**
  - `organizationalUnitEntity.ts` - Core business entity representing an organizational unit
  - `updateOrganizationalUnitEntity.ts` - Entity for update operations with optional fields
  
- **Repositories** (Interfaces)
  - `organizationalUnitRepository.ts` - Repository contract defining data access methods
    - `updateOrganizationalUnit()` - Updates organizational unit
    - `findById()` - Retrieves organizational unit by ID
    - `validateParentUnit()` - Validates parent unit existence
  
- **Use Cases**
  - `updateOrganizationalUnitUseCase.ts` - Business logic for updating organizational units
    - Validates organizational unit exists
    - Validates parent unit if provided
    - Executes update operation
    - Returns updated entity

#### 2. **Data Layer** (`src/data/`)
- **Repository Implementations**
  - `organizationalUnitRepositoryImp.ts` - Concrete implementation of repository interface
    - Builds dynamic UPDATE query based on provided fields
    - Handles parameterized queries to prevent SQL injection
    - Fetches updated record with relationships
    - Handles database errors gracefully
  
- **Mappers**
  - `organizationalUnitMapper.ts` - Maps database rows to domain entities
    - Constructs complete address from available data
    - Handles null values appropriately

#### 3. **Presentation Layer** (`src/presentation/`)
- **Controllers**
  - `organizationalUnitController.ts` - Handles HTTP requests and responses
    - Validates path parameters
    - Validates request body
    - Validates data types
    - Handles authentication
    - Returns appropriate HTTP status codes
  
- **DTOs** (Data Transfer Objects)
  - `updateOrganizationalUnitRequestDto.ts` - Defines request structure
  - `organizationalUnitResponseDto.ts` - Defines response structure
  
- **Routes**
  - `organizationalUnitRoutes.ts` - Route definitions and middleware configuration
    - Applies JWT authentication middleware
    - Maps HTTP PUT to controller method
  
- **Middleware**
  - `authMiddleware.ts` - JWT authentication middleware
    - Validates JWT token
    - Extracts user information
    - Returns 401 for invalid/missing tokens

### Dependency Injection
All components are registered in the DI container using InversifyJS:

```typescript
// Types
TYPES.OrganizationalUnitRepository
TYPES.UpdateOrganizationalUnitUseCase
TYPES.OrganizationalUnitController

// Bindings
container.bind(TYPES.OrganizationalUnitRepository).to(OrganizationalUnitRepositoryImp)
container.bind(TYPES.UpdateOrganizationalUnitUseCase).to(UpdateOrganizationalUnitUseCase)
container.bind(TYPES.OrganizationalUnitController).to(OrganizationalUnitController)
```

## Validation Rules

### Path Parameter Validation
- `org_unit_id` must be a valid integer
- `org_unit_id` must exist in the database

### Request Body Validation
- At least one field must be provided for update
- All numeric fields must be valid integers (if provided):
  - `unit_type_id`
  - `parent_org_unit_id`
  - `region_id`
  - `prov_id`
  - `city_id`
  - `brgy_id`
- `parent_org_unit_id` must reference an existing organizational unit (if provided)

### Business Rules
- Parent organizational unit must exist before it can be assigned
- Cannot create circular parent-child relationships
- Updates are atomic - either all changes succeed or none are applied
- `updated_by` and `updated_at` are automatically set on every update

## Usage Examples

### cURL Examples

#### Update Organization Name
```bash
curl -X PUT http://localhost:8080/api/organizational-units/105 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "org_unit_name": "Department of Science and Technology - DOST"
  }'
```

#### Update Multiple Fields
```bash
curl -X PUT http://localhost:8080/api/organizational-units/105 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "org_unit_name": "DOST",
    "org_unit_descr": "Leading S&T agency",
    "address": "General Santos Avenue, Bicutan"
  }'
```

#### Update Parent Unit
```bash
curl -X PUT http://localhost:8080/api/organizational-units/107 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parent_org_unit_id": 105
  }'
```

### JavaScript/TypeScript Examples

#### Basic Update
```typescript
const updateOrganizationalUnit = async (orgUnitId: number, updateData: any, token: string) => {
  const response = await fetch(`http://localhost:8080/api/organizational-units/${orgUnitId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Update failed: ${error.message}`);
  }

  return await response.json();
};

// Usage
const updatedUnit = await updateOrganizationalUnit(105, {
  org_unit_name: "Updated Name",
  org_unit_descr: "Updated Description"
}, jwtToken);

console.log('Updated unit:', updatedUnit);
```

#### With Error Handling
```typescript
const updateWithErrorHandling = async (orgUnitId: number, updateData: any, token: string) => {
  try {
    const response = await fetch(`http://localhost:8080/api/organizational-units/${orgUnitId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (response.status === 404) {
      throw new Error('Organizational unit not found.');
    }

    if (response.status === 400) {
      const error = await response.json();
      throw new Error(`Validation error: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error('An unexpected error occurred.');
    }

    return await response.json();
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};
```

## Testing

### Manual Testing with Postman

#### Test Case 1: Successful Update (200 OK)
**Request:**
```json
PUT http://localhost:8080/api/organizational-units/105
Authorization: Bearer {valid_token}
Content-Type: application/json

{
  "org_unit_name": "Updated Department Name",
  "org_unit_descr": "Updated description"
}
```

**Expected Response:**
- Status: 200 OK
- Body contains updated organizational unit object
- Database record is updated

#### Test Case 2: Invalid org_unit_id (404 Not Found)
**Request:**
```json
PUT http://localhost:8080/api/organizational-units/9999
Authorization: Bearer {valid_token}
Content-Type: application/json

{
  "org_unit_name": "Test"
}
```

**Expected Response:**
- Status: 404 Not Found
- Message: "Organizational unit not found"
- Database unchanged

#### Test Case 3: Unauthorized Access (401 Unauthorized)
**Request:**
```json
PUT http://localhost:8080/api/organizational-units/105
Content-Type: application/json

{
  "org_unit_name": "Test"
}
```

**Expected Response:**
- Status: 401 Unauthorized
- Message: "unauthorized"
- Database unchanged

#### Test Case 4: Invalid parent_org_unit_id (400 Bad Request)
**Request:**
```json
PUT http://localhost:8080/api/organizational-units/105
Authorization: Bearer {valid_token}
Content-Type: application/json

{
  "parent_org_unit_id": 99999
}
```

**Expected Response:**
- Status: 400 Bad Request
- Message: "Invalid parent_org_unit_id: Parent unit does not exist"
- Database unchanged

#### Test Case 5: Invalid Data Type (400 Bad Request)
**Request:**
```json
PUT http://localhost:8080/api/organizational-units/105
Authorization: Bearer {valid_token}
Content-Type: application/json

{
  "unit_type_id": "invalid_string"
}
```

**Expected Response:**
- Status: 400 Bad Request
- Message: "Invalid unit_type_id: must be a valid integer"
- Database unchanged

### Test Scenarios Summary

| Scenario | Input | Expected Status | Expected Behavior |
|----------|-------|-----------------|-------------------|
| Successful update | Valid data + valid JWT | 200 OK | Database updated, returns updated object |
| Invalid org_unit_id | Non-existent ID | 404 Not Found | Database unchanged, error message |
| No authentication | No Authorization header | 401 Unauthorized | Database unchanged, error message |
| Invalid JWT | Invalid/expired token | 401 Unauthorized | Database unchanged, error message |
| Invalid parent unit | Non-existent parent_org_unit_id | 400 Bad Request | Database unchanged, validation error |
| Invalid data type | String for numeric field | 400 Bad Request | Database unchanged, validation error |
| No update data | Empty request body | 400 Bad Request | Database unchanged, error message |

## Error Handling

### Client Errors (4xx)
| Status | Cause | Solution |
|--------|-------|----------|
| 400 | Invalid org_unit_id format | Provide valid integer for org_unit_id |
| 400 | Invalid data type | Ensure numeric fields contain integers |
| 400 | Invalid parent_org_unit_id | Provide existing parent unit ID |
| 400 | No update data | Provide at least one field to update |
| 401 | No Authorization header | Add `Authorization: Bearer <token>` header |
| 401 | Invalid token | Generate new JWT token |
| 401 | Expired token | Refresh or regenerate JWT token |
| 404 | org_unit_id not found | Verify the organizational unit exists |

### Server Errors (5xx)
| Status | Cause | Solution |
|--------|-------|----------|
| 500 | Database connection failed | Check database credentials and connectivity |
| 500 | SQL query error | Verify database schema and data integrity |
| 500 | Unexpected error | Check server logs for details |

### Logging
All errors are logged to console with detailed information:
- Error type and message
- Stack trace
- Request context (path parameters, user ID)
- Database query details (when applicable)

## Security Considerations

### Authentication
- All requests require valid JWT token
- Tokens are validated using `authMiddleware`
- User information extracted from token is used for audit trail (`updated_by`)

### Authorization
- Currently assumes authenticated users have permission to update organizational units
- Future enhancement: Role-based access control (RBAC)

### Data Validation
- All user input is validated before database operations
- Parameterized queries prevent SQL injection
- Type checking prevents invalid data types
- Business rule validation prevents invalid relationships

### Audit Trail
- `updated_by` field records which user made the change
- `updated_at` timestamp records when the change occurred
- Original values are overwritten (consider adding change history table for full audit)

## History

### Version 1.0.0 (Current) Jan 2026
- ✅ Initial implementation
- ✅ JWT authentication
- ✅ Dynamic partial updates (update only provided fields)
- ✅ Parent unit validation
- ✅ Comprehensive input validation
- ✅ Clean architecture implementation
- ✅ Dependency injection with InversifyJS
- ✅ Proper error handling and status codes
- ✅ Audit trail (updated_by, updated_at)
- ✅ RESTful API design following acceptance criteria