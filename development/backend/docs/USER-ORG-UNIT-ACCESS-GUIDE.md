# MANAGE USER ACCESS TO ORGANIZATIONAL UNITS DOCUMENTATION

API endpoints for managing user access to organizational units including granting, updating (activate/deactivate), and retrieving access permissions.

---

## ENDPOINTS

### 1. GRANT USER ACCESS
**POST** /api/user-access

Grants a user access to a specific organizational unit.

---

### 2. UPSERT USER ACCESS (ACTIVATE / DEACTIVATE)
**PUT** /api/user-org-unit-access

Creates or updates user access status (activate/deactivate).

---

### 3. GET USER ACCESS
**GET** /api/user-org-unit-access?user_id={id}

Retrieves all access permissions of a specific user.

---

## USE CASE

As an admin, I want to manage user access to organizational units so that I can control permissions dynamically (grant, activate, deactivate, and view access).

---

## REQUEST HEADERS

| Header        | Type   | Required | Description            |
|---------------|--------|----------|------------------------|
| Authorization | string | Yes      | Bearer token (JWT)     |
| Content-Type  | string | Yes      | application/json       |

---

## REQUEST EXAMPLES

### Grant

{ "user_id": 2, "org_unit_id": 101, "perm_id": 457 }

### Activate

{ "user_id": 2, "org_unit_id": 101, "perm_id": 457, "is_active": true }

### Deactivate

{ "user_id": 2, "org_unit_id": 101, "perm_id": 457, "is_active": false }

------------------------------------------------------------------------

## SUCCESS RESPONSE FORMAT (STANDARDIZED)

{ "status": 201, "message": "success", "data": { "user_access_id": 27,
"user_id": 2, "org_unit_id": 101, "perm_id": 457, "is_active": true,
"created_at": "timestamp", "updated_at": "timestamp", "created": true }
}

------------------------------------------------------------------------

## GET RESPONSE

{ "status": 200, "message": "success", "data": \[ { "user_access_id":
16, "user_id": 2, "org_unit_id": 103, "perm_id": 1, "is_active": false,
"created_at": "timestamp", "updated_at": "timestamp" } \] }

------------------------------------------------------------------------

## ERROR HANDLING

### Invalid JSON

{ "error": "Invalid request.", "message": "Invalid JSON format." }

### Missing Field

{ "status": 400, "message": "org_unit_id is required", "data": {} }

### Invalid user_id

{ "status": 400, "message": "Invalid user_id", "data": {} }

------------------------------------------------------------------------

## MISSING FIELD (400 BAD REQUEST)

```json
{
  "error": "Bad Request",
  "message": "org_unit_id is required."
}
```

---

## UNAUTHORIZED (401)

```json
{
  "status": 401,
  "message": "unauthorized",
  "data": {}
}
```

---

# BUSINESS LOGIC

### Grant / Update Logic
- Validate required fields
- Validate data types
- Check if org_unit exists
- Perform UPSERT operation
- Determine response message:
  - New → granted
  - Existing active → re-activated
  - Existing inactive → deactivated

---

### Retrieval Logic
- Validate user_id
- Fetch all records by user_id
- Map response format
- Return structured permissions list

---

# DATABASE OPERATION

### UPSERT QUERY
```sql
INSERT INTO tbluser_org_unit_access (user_id, org_unit_id, perm_id, is_active)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, org_unit_id, perm_id)
DO UPDATE SET is_active = EXCLUDED.is_active,
              updated_at = NOW();
```

---

### GET QUERY
```sql
SELECT 
    user_id,
    org_unit_id,
    perm_id,
    is_active
FROM 
    tbluser_org_unit_access
WHERE 
    user_id = $1;
```

---

# ARCHITECTURE

Follows Clean Architecture

## LAYER STRUCTURE

presentation/
 ├── controllers/user-org-unit-access/
 │     userOrgUnitAccessController.ts
 ├── routes/user-org-unit-access/
 │     userOrgUnitAccessRoutes.ts

domain/
 ├── use-cases/user-org-unit-access/
 │     upsertUserOrgUnitAccessUseCase.ts
 │     getUserOrgUnitAccessByUserUseCase.ts
 ├── entities/
 │     userOrgUnitAccessEntity.ts
 └── repositories/
       userOrgUnitAccessRepository.ts

data/
 ├── repositories-imp/
 │     userOrgUnitAccessRepositoryImpl.ts
 ├── mappers/
 │     userOrgUnitAccessMapper.ts
 └── data-sources/
       databaseService.ts

di/
 └── container.ts

---

# KEY COMPONENTS

1. Controller
   - Handles HTTP request/response
   - Validates inputs
   - Returns structured response

2. Use Case
   - Business logic execution
   - Calls repository

3. Repository
   - Executes SQL queries

4. Mapper
   - Maps DB → Domain → DTO

5. DI Container
   - Injects dependencies

---

# BUSINESS VALIDATION

- user_id must be integer
- org_unit_id must exist
- perm_id must be valid
- is_active must be boolean
- No duplicate records (UPSERT enforced)

---

# SECURITY

- JWT authentication required
- Authorization header required
- Parameterized SQL queries
- No sensitive data exposed

---

# TESTING

Suggested Test Cases:

- Grant access (201)
- Activate access (200)
- Deactivate access (200)
- Get user permissions (200)
- Invalid JSON (400)
- Missing fields (400)
- Unauthorized (401)

---

# PERFORMANCE

- Indexed keys improve lookup
- UPSERT avoids duplicate writes
- Lightweight queries
- Connection pooling enabled
- Target response time: < 300ms
