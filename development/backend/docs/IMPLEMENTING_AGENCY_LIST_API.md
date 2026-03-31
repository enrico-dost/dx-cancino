# Implementing Agency List API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [API Endpoint](#api-endpoint)
5. [Query Parameters](#query-parameters)
6. [Request & Response Examples](#request--response-examples)
7. [Response Format](#response-format)
8. [Error Handling](#error-handling)
9. [Use Cases & Scenarios](#use-cases--scenarios)
10. [OpenAPI Specification](#openapi-specification)
11. [Architecture](#architecture)
12. [Code Documentation](#code-documentation)
13. [Testing](#testing)
14. [Usage Examples](#usage-examples)
15. [Performance & Limits](#performance--limits)
16. [Troubleshooting](#troubleshooting)
17. [Related Documentation](#related-documentation)

---

## Overview

The **Implementing Agency List API** provides a secure, flexible endpoint to retrieve organizational units (implementing agencies) filtered by one or more unit type identifiers. This API enables clients to dynamically filter programs and projects by different organizational types for reporting and analysis purposes.

**API Version:** 1.0  
**Last Updated:** March 31, 2026  
**Status:** Production Ready ✓  
**Specification:** [OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3)

### Objectives

- Provide a secure, JWT-authenticated API endpoint for retrieving organizational units
- Support flexible filtering by multiple unit type identifiers
- Maintain consistent response formatting across all scenarios
- Return real database records without transformation or mock data
- Enforce strict input validation and error handling

---

## API Specification

### Endpoint

```
GET /api/implementing-agency/unit-type
```

### Authentication

**Required:** Yes (JWT Bearer Token)

```
Authorization: Bearer <valid_jwt_token>
```

### Content Type

```
Accept: application/json
```

---

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `unit_types` | string (comma-separated integers) | ❌ No | 1 | Filters by unit_type_id. Accepts single value or comma-separated list (e.g., `1,2,3`) |

### Parameter Validation

- Each value must be a positive integer (0-9 digits)
- Spaces around commas are trimmed automatically
- Invalid values (non-numeric) trigger HTTP 400 Bad Request response

#### Valid Examples:
- `?unit_types=1`
- `?unit_types=2`
- `?unit_types=1,2`
- `?unit_types=1, 2, 3` (spaces are trimmed)

#### Invalid Examples:
- `?unit_types=abc` → HTTP 400
- `?unit_types=1,abc,2` → HTTP 400
- `?unit_types=-1` → HTTP 400

---

## Response Format

### Success Response (HTTP 200)

```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    {
      "org_unit_id": 102,
      "org_unit_name": "PCAARRD"
    },
    {
      "org_unit_id": 103,
      "org_unit_name": "PCHRD"
    }
  ]
}
```

### Empty Result (HTTP 200)

When no records match the filter criteria:

```json
{
  "status": 200,
  "message": "No implementing agencies found.",
  "data": []
}
```

### Validation Error (HTTP 400)

Invalid query parameter values:

```json
{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

### Unauthorized (HTTP 401)

Missing or invalid JWT token:

```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

### Server Error (HTTP 500)

Internal server error:

```json
{
  "status": 500,
  "message": "Internal server error",
  "errors": {
    "detail": "Error message details"
  }
}
```

---

## Scenarios

### Scenario 1: Default Retrieval (Agency)

**Request:**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

**Description:**  
When no query parameters are provided, the API defaults to filtering by unit_type_id = 1 (Agencies).

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 102, "org_unit_name": "PCAARRD" },
    { "org_unit_id": 103, "org_unit_name": "PCHRD" },
    { "org_unit_id": 104, "org_unit_name": "PCIEERD" },
    { "org_unit_id": 139, "org_unit_name": "ASTI" },
    { "org_unit_id": 140, "org_unit_name": "FNRI" },
    { "org_unit_id": 141, "org_unit_name": "FPRDI" },
    { "org_unit_id": 142, "org_unit_name": "ITDI" },
    { "org_unit_id": 143, "org_unit_name": "MIRDC" },
    { "org_unit_id": 144, "org_unit_name": "PNRI" },
    { "org_unit_id": 145, "org_unit_name": "PTRI" },
    { "org_unit_id": 146, "org_unit_name": "PAGASA" },
    { "org_unit_id": 147, "org_unit_name": "PHIVOLCS" },
    { "org_unit_id": 154, "org_unit_name": "SEI" },
    { "org_unit_id": 150, "org_unit_name": "PSHS" },
    { "org_unit_id": 148, "org_unit_name": "STII" },
    { "org_unit_id": 152, "org_unit_name": "TAPI" },
    { "org_unit_id": 156, "org_unit_name": "NAST" },
    { "org_unit_id": 149, "org_unit_name": "NRCP" }
  ]
}
```

---

### Scenario 2: Single Filter (Regional Offices)

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=2 HTTP/1.1
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

**Description:**  
Retrieve all organizational units of type 2 (Regional Offices).

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 158, "org_unit_name": "DOST-CAR" },
    { "org_unit_id": 159, "org_unit_name": "DOST-Region I" },
    { "org_unit_id": 160, "org_unit_name": "DOST-Region II" }
  ]
}
```

---

### Scenario 3: Multiple Filters

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=1,2 HTTP/1.1
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

**Description:**  
Retrieve organizations matching either unit_type_id = 1 OR unit_type_id = 2.

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 102, "org_unit_name": "PCAARRD" },
    { "org_unit_id": 103, "org_unit_name": "PCHRD" },
    { "org_unit_id": 158, "org_unit_name": "DOST-CAR" },
    { "org_unit_id": 159, "org_unit_name": "DOST-Region I" },
    { "org_unit_id": 160, "org_unit_name": "DOST-Region II" }
  ]
}
```

---

### Scenario 4: Invalid Query Parameter

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=abc HTTP/1.1
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

**Description:**  
Non-numeric values are rejected with HTTP 400 Bad Request.

**Response:**
```json
{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

---

### Scenario 5: Unauthorized Access

**Request (No Token):**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Accept: application/json
```

**Response:**
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

**Request (Invalid Token):**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Authorization: Bearer invalid_token_value
Accept: application/json
```

**Response:**
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

---

### Scenario 6: Empty Data Set

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=999 HTTP/1.1
Authorization: Bearer <valid_jwt_token>
Accept: application/json
```

**Description:**  
When no records match the provided filter.

**Response:**
```json
{
  "status": 200,
  "message": "No implementing agencies found.",
  "data": []
}
```

---

- Provide a secure, JWT-authenticated API endpoint for retrieving organizational units
- Support flexible filtering by multiple unit type identifiers
- Maintain consistent response formatting across all scenarios
- Return real database records without transformation or mock data
- Enforce strict input validation and error handling

---

## Quick Start

### 1. Get a JWT Token

Obtain a valid JWT token from the authentication service with proper credentials.

```bash
# Example: Obtain token from your auth endpoint
curl -X POST https://your-auth-service/token \
  -H "Content-Type: application/json" \
  -d '{"username":"user@dost.gov.ph","password":"password"}'

# Response contains access_token
```

### 2. Make Your First Request

```bash
curl -X GET "https://your-api.dost.gov.ph/api/implementing-agency/unit-type" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json"
```

### 3. Parse the Response

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

---

## Authentication

**Required:** Yes (Bearer Token / JWT)

### Token Format

```
Authorization: Bearer <valid_jwt_token>
```

### Token Requirements

- **Type:** JWT (JSON Web Token)
- **Algorithm:** HS256
- **Expiration:** Checked on every request
- **Invalid tokens:** Result in HTTP 401 Unauthorized

### Example with Token

```http
GET /api/implementing-agency/unit-type HTTP/1.1
Host: api.dost.gov.ph
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

---

## API Endpoint

### GET /api/implementing-agency/unit-type

Retrieves a list of organizational units filtered by unit type(s).

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **Path** | `/api/implementing-agency/unit-type` |
| **Base URL** | `https://your-api.dost.gov.ph` |
| **Full URL** | `https://your-api.dost.gov.ph/api/implementing-agency/unit-type` |
| **Authentication** | Required (Bearer JWT Token) |
| **Content-Type** | `application/json` |
| **Response Format** | JSON |

---

## Query Parameters

| Parameter | Type | Required | Default | Description | Validation |
|-----------|------|----------|---------|-------------|------------|
| `unit_types` | string | No | `1` | Comma-separated list of unit_type_id values | Must be integer(s) only; spaces trimmed automatically |

### Parameter Details

**unit_types** (Optional, String, Default: 1)
- Filters organizational units by their type(s)
- Accepts single or multiple comma-separated integers
- No spaces required: both `1,2` and `1, 2` are valid
- Must contain only digits and commas
- Invalid characters trigger HTTP 400 Bad Request

#### Valid Examples:
```
?unit_types=1                    → type 1 only
?unit_types=2                    → type 2 only  
?unit_types=1,2                  → types 1 or 2
?unit_types=1, 2, 3              → types 1, 2, or 3 (spaces trimmed)
/api/implementing-agency/unit-type   → defaults to type 1 (Agency)
```

#### Invalid Examples:
```
?unit_types=abc                  → ❌ Non-numeric
?unit_types=1,abc,2              → ❌ Mixed valid/invalid
?unit_types=-1                   → ❌ Negative numbers
?unit_types=1.5                  → ❌ Decimals
?unit_types=1; DELETE FROM ...   → ❌ Invalid characters
```

---

## Request & Response Examples

### Request Format

```http
GET /api/implementing-agency/unit-type?unit_types=1,2 HTTP/1.1
Host: api.dost.gov.ph
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
User-Agent: Mozilla/5.0
```

### Response Format (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json
Date: Mon, 31 Mar 2026 10:30:45 GMT
Server: nginx

{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    {
      "org_unit_id": 102,
      "org_unit_name": "PCAARRD"
    },
    {
      "org_unit_id": 103,
      "org_unit_name": "PCHRD"
    }
  ]
}
```

### Response Format (Error)

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
Date: Mon, 31 Mar 2026 10:30:46 GMT

{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

---

## Response Format

### Standardized Response Structure

All API responses follow this consistent JSON structure:

```typescript
{
  status: number;              // HTTP status code (200, 400, 401, 500)
  message: string;             // Human-readable description
  data: any;                   // Response payload (array, object, or empty)
}
```

### Response Data Model

#### Organizational Unit Object

```typescript
{
  org_unit_id: number;      // Unique identifier (integer, primary key)
  org_unit_name: string;    // Organization name (abbreviation extracted)
}
```

### Success Response (HTTP 200)

**Scenario 1: Data Found**

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

**Scenario 2: Empty Result**

```json
{
  "status": 200,
  "message": "No implementing agencies found.",
  "data": []
}
```

---

## Error Handling

### Error Response Structure

All error responses follow this format:

```typescript
{
  status: number;           // HTTP status code
  message: string;          // Error description
  data: object;             // Additional error details (usually empty)
}
```

### Error Codes & Status Details

| HTTP Status | Error Code | Message | Cause | Action |
|-------------|-----------|---------|-------|--------|
| **400** | INVALID_PARAMETER | `Invalid unit_types parameter. Must be comma-separated integers.` | Non-numeric values in unit_types | Verify parameter contains only digits and commas |
| **401** | UNAUTHORIZED | `Unauthorized` | Missing or invalid JWT token | Provide valid JWT token in Authorization header |
| **401** | TOKEN_EXPIRED | `Unauthorized` | JWT token has expired | Refresh/renew JWT token |
| **500** | INTERNAL_ERROR | `Internal server error` | Database or unexpected server error | Check server logs; contact support |

### HTTP Status Codes

#### 200 OK
- **Meaning:** Request successful
- **When:** Data retrieved (or empty result)
- **Handling:** Parse response.data array

```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [...]
}
```

#### 400 Bad Request
- **Meaning:** Client request invalid
- **When:** Invalid parameter format
- **Handling:** Validate and retry with correct format

```json
{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

#### 401 Unauthorized
- **Meaning:** Authentication failed or missing
- **When:** Invalid, missing, or expired JWT token
- **Handling:** Obtain/refresh valid JWT token

```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

#### 500 Internal Server Error
- **Meaning:** Unexpected server error
- **When:** Database connectivity, configuration issues
- **Handling:** Retry after delay; contact support if persists

```json
{
  "status": 500,
  "message": "Internal server error",
  "errors": {
    "detail": "Database connection failed"
  }
}
```

### Error Handling Best Practices

**For Clients:**
1. Check HTTP status code first
2. For HTTP 400: Fix request parameters and retry
3. For HTTP 401: Refresh JWT token and retry
4. For HTTP 500: Wait and retry with exponential backoff

**Example Error Handling (JavaScript):**
```javascript
async function getAgencies(unitTypes) {
  try {
    const response = await fetch('/api/implementing-agency/unit-type?unit_types=' + unitTypes, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      switch (response.status) {
        case 400:
          console.error('Invalid parameters:', data.message);
          break;
        case 401:
          console.error('Token expired, please re-authenticate');
          break;
        case 500:
          console.error('Server error, please retry');
          break;
      }
      return null;
    }
    
    return data.data; // Return the data array
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

---

## Use Cases & Scenarios

### Scenario 1: Default Retrieval (Agency)

**Use Case:** Get all agencies without specifying filters

**Request:**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Authorization: Bearer <token>
Accept: application/json
```

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 102, "org_unit_name": "PCAARRD" },
    { "org_unit_id": 103, "org_unit_name": "PCHRD" },
    { "org_unit_id": 104, "org_unit_name": "PCIEERD" },
    { "org_unit_id": 139, "org_unit_name": "ASTI" }
  ]
}
```

---

### Scenario 2: Single Filter (Regional Offices)

**Use Case:** Retrieve only regional office units

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=2 HTTP/1.1
Authorization: Bearer <token>
Accept: application/json
```

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 158, "org_unit_name": "DOST-CAR" },
    { "org_unit_id": 159, "org_unit_name": "DOST-Region I" },
    { "org_unit_id": 160, "org_unit_name": "DOST-Region II" }
  ]
}
```

---

### Scenario 3: Multiple Filters

**Use Case:** Retrieve agencies AND regional offices together

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=1,2 HTTP/1.1
Authorization: Bearer <token>
Accept: application/json
```

**Response:**
```json
{
  "status": 200,
  "message": "Successfully retrieved implementing agencies.",
  "data": [
    { "org_unit_id": 102, "org_unit_name": "PCAARRD" },
    { "org_unit_id": 103, "org_unit_name": "PCHRD" },
    { "org_unit_id": 158, "org_unit_name": "DOST-CAR" },
    { "org_unit_id": 159, "org_unit_name": "DOST-Region I" }
  ]
}
```

---

### Scenario 4: Invalid Query Parameter

**Use Case:** Client sends invalid parameter format

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=abc HTTP/1.1
Authorization: Bearer <token>
Accept: application/json
```

**Response:**
```http
HTTP/1.1 400 Bad Request

{
  "status": 400,
  "message": "Invalid unit_types parameter. Must be comma-separated integers.",
  "data": {}
}
```

---

### Scenario 5: Unauthorized Access

**Use Case: Missing Token**

**Request:**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Accept: application/json
```

**Response:**
```http
HTTP/1.1 401 Unauthorized

{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

**Use Case: Invalid Token**

**Request:**
```http
GET /api/implementing-agency/unit-type HTTP/1.1
Authorization: Bearer invalid_token_xyz
Accept: application/json
```

**Response:**
```http
HTTP/1.1 401 Unauthorized

{
  "status": 401,
  "message": "Unauthorized",
  "data": {}
}
```

---

### Scenario 6: Empty Data Set

**Use Case:** Filter returns no results

**Request:**
```http
GET /api/implementing-agency/unit-type?unit_types=999 HTTP/1.1
Authorization: Bearer <token>
Accept: application/json
```

**Response:**
```http
HTTP/1.1 200 OK

{
  "status": 200,
  "message": "No implementing agencies found.",
  "data": []
}
```

---

## OpenAPI Specification

### OpenAPI 3.0 YAML Definition

```yaml
openapi: 3.0.3
info:
  title: DOST Organization Management API
  description: API for managing organizational units and implementing agencies
  version: 1.0.0
  contact:
    name: API Support
    email: api.support@dost.gov.ph

servers:
  - url: https://api.dost.gov.ph
    description: Production Server
  - url: http://localhost:3000
    description: Development Server

paths:
  /api/implementing-agency/unit-type:
    get:
      summary: Get Implementing Agencies by Unit Type
      description: Retrieve organizational units filtered by one or more unit type identifiers
      operationId: getImplementingAgenciesByUnitType
      tags:
        - Implementing Agency
      
      security:
        - bearerAuth: []
      
      parameters:
        - name: unit_types
          in: query
          required: false
          schema:
            type: string
            example: "1,2"
          description: Comma-separated list of unit_type_id values (default 1)
      
      responses:
        '200':
          description: Successfully retrieved implementing agencies
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: integer
                    example: 200
                  message:
                    type: string
                    example: "Successfully retrieved implementing agencies."
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/OrganizationalUnit'
        
        '400':
          description: Invalid query parameter format
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 400
                message: "Invalid unit_types parameter. Must be comma-separated integers."
                data: {}
        
        '401':
          description: Unauthorized - Missing or invalid JWT token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 401
                message: "Unauthorized"
                data: {}
        
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    OrganizationalUnit:
      type: object
      required:
        - org_unit_id
        - org_unit_name
      properties:
        org_unit_id:
          type: integer
          example: 102
          description: Unique organizational unit identifier
        org_unit_name:
          type: string
          example: "PCAARRD"
          description: Organizational unit name (abbreviation)
    
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          example: 400
        message:
          type: string
          example: "Invalid request"
        data:
          type: object
          example: {}
  
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT bearer token for authentication
```

### Using the OpenAPI Specification

**Option 1: View with Swagger UI**
```bash
# Host the YAML file and access through Swagger UI
https://swagger.io/tools/swagger-ui/
# Upload or link to: openapi-spec.yaml
```

**Option 2: View with Redoc**
```bash
# Host the YAML file and access through Redoc
https://redoc.ly/
# Upload or link to: openapi-spec.yaml
```

**Option 3: Generate Client SDKs**
```bash
# Using OpenAPI Generator
npx @openapitools/openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g javascript \
  -o ./generated-client
```

---

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    Client[Client Application]
    
    subgraph "API Layer"
        Routes[API Routes]
        Controller[Controller]
        Middleware[JWT Middleware]
    end
    
    subgraph "Business Logic"
        UseCase[Use Case Layer]
        Validation[Parameter Validation]
    end
    
    subgraph "Data Layer"
        Repository[Repository]
        Mapper[Data Mapper]
    end
    
    Database[(PostgreSQL DB)]
    
    Client -->|HTTP GET| Middleware
    Middleware -->|Auth Check| Routes
    Routes --> Controller
    Controller --> Validation
    Validation -->|Valid Params| UseCase
    UseCase --> Repository
    Repository --> Mapper
    Mapper --> Database
    Database -->|Query Result| Mapper
    Mapper -->|Entity List| Repository
    Repository -->|Data| UseCase
    UseCase -->|Agencies| Controller
    Controller -->|JSON Response| Client
```

### Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Auth as Middleware<br/>(JWT)
    participant Ctrl as Controller
    participant UseCase as Use Case
    participant Repo as Repository
    participant DB as Database

    Client->>Auth: GET /api/implementing-agency/unit-type<br/>Authorization: Bearer token
    
    Auth->>Auth: Validate JWT
    alt Token Invalid
        Auth-->>Client: 401 Unauthorized
    else Token Valid
        Auth->>Ctrl: Pass request
        Ctrl->>Ctrl: Parse & validate<br/>unit_types parameter
        alt Invalid Parameter
            Ctrl-->>Client: 400 Bad Request
        else Valid Parameter
            Ctrl->>UseCase: execute([unitTypeIds])
            UseCase->>UseCase: Default to [1] if empty
            UseCase->>Repo: getByUnitTypes([ids])
            Repo->>DB: SELECT org_unit_id, org_unit_name<br/>WHERE unit_type_id = ANY($1)
            DB-->>Repo: Result rows
            Repo->>Repo: Map to entities
            Repo-->>UseCase: Entity[]
            UseCase-->>Ctrl: Entity[]
            Ctrl->>Ctrl: Format response
            Ctrl-->>Client: 200 JSON Response
        end
    end
```

### Component Responsibilities

| Component | File | Responsibility |
|-----------|------|-----------------|
| **Routes** | `implementingAgencyRoutes.ts` | Defines HTTP route, applies middleware |
| **Controller** | `implementingAgencyController.ts` | Handles HTTP request/response, parameter validation |
| **Use Case** | `getImplementingAgenciesByUnitTypeUseCase.ts` | Business logic, default handling |
| **Repository** | `implementingAgencyRepositoryImp.ts` | Database queries, SQL execution |
| **Mapper** | `implementingAgencyMapper.ts` | Model-to-entity conversion |
| **Entity** | `implementingAgencyEntity.ts` | Domain model definition |
| **Middleware** | `authMiddleware.ts` | JWT authentication, authorization |

---

## Code Documentation

### API Implementation Overview

This section provides code-level documentation for developers working with the implementation.

#### File Structure

```
src/
├── presentation/
│   ├── controllers/
│   │   └── implementing-agency/
│   │       └── implementingAgencyController.ts    # HTTP handler
│   ├── routes/
│   │   └── implementing-agency/
│   │       └── implementingAgencyRoutes.ts        # Route definition
│   └── models/dto/
│       └── implementing-agency/
│           └── implementingAgencyDto.ts           # Response DTO
├── domain/
│   ├── entities/
│   │   └── implementing-agency/
│   │       └── implementingAgencyEntity.ts        # Domain entity
│   ├── repositories/
│   │   └── implementing-agency/
│   │       └── implementingAgencyRepository.ts    # Repository interface
│   └── use-cases/
│       └── implementing-agency/
│           └── getImplementingAgenciesByUnitTypeUseCase.ts
├── data/
│   ├── models/
│   │   └── implementing-agency/
│   │       └── implementingAgencyModel.ts         # DB model
│   ├── mappers/
│   │   └── implementing-agency/
│   │       └── implementingAgencyMapper.ts        # Model mapper
│   └── repositories-imp/
│       └── implementing-agency/
│           └── implementingAgencyRepositoryImp.ts # Repository impl
└── utils/
    └── authMiddleware.ts                          # JWT middleware
```

### JSDoc Examples

#### Controller

```typescript
/**
 * Implementing Agency Controller
 * Handles HTTP requests for implementing agency operations
 * 
 * Routes:
 * - GET /api/implementing-agency/unit-type
 * 
 * @class implementingAgencyController
 * @injectable
 */
export class implementingAgencyController {
    /**
     * Get implementing agencies by unit type(s)
     * Supports query parameter: unit_types (comma-separated list or single value)
     * Defaults to unit_type=1 (Agency) if not provided
     * 
     * @async
     * @param {Request} req - Express request object containing query params
     * @param {Response} res - Express response object
     * @returns {Promise<void>} Responds with JSON
     * 
     * @example
     * // Request: GET /api/implementing-agency/unit-type?unit_types=1,2
     * // Response: { status: 200, message: "...", data: [...] }
     */
    async getByUnitTypes(req: Request, res: Response): Promise<void>
}
```

#### Repository

```typescript
/**
 * Implementing Agency Repository Interface
 * Defines contract for data access operations
 * 
 * @interface ImplementingAgencyRepository
 */
export interface ImplementingAgencyRepository {
    /**
     * Get implementing agencies filtered by unit type(s)
     * 
     * @param {number[]} unitTypeIds - Array of unit_type_id values to filter by
     * @returns {Promise<ImplementingAgencyEntity[]>} List of agencies matching criteria
     * @throws {Error} If database query fails
     * 
     * @example
     * const agencies = await repo.getByUnitTypes([1, 2]);
     * // Returns: [{ org_unit_id: 102, org_unit_name: "PCAARRD" }, ...]
     */
    getByUnitTypes(unitTypeIds: number[]): Promise<ImplementingAgencyEntity[]>;
}
```

#### Entity

```typescript
/**
 * Implementing Agency Entity
 * Represents an organizational unit that implements programs/projects
 * 
 * @interface ImplementingAgencyEntity
 */
export interface ImplementingAgencyEntity {
    /** Unique organizational unit identifier (primary key) */
    org_unit_id: number;
    
    /** Organizational unit name (abbreviation) */
    org_unit_name: string;
}
```

---

## Testing

### Running Tests

```bash
# Run all implementing agency tests
npm test -- implementingAgency.test.ts

# Run with verbose output
npm test -- implementingAgency.test.ts --verbose

# Run and coverage report
npm test -- implementingAgency.test.ts --coverage
```

### Test Coverage

**File:** `test/implementingAgency.test.ts`

**Test Scenarios:** 12 tests covering all acceptance criteria

```
PASS  test/implementingAgency.test.ts

Implementing Agency List API - GET /api/implementing-agency/unit-type
  Scenario: Successful Data Retrieval with Default Filter
    ✓ should retrieve agencies by default filter (unit_types=1)
  Scenario: Successful Data Retrieval with Explicit Single Filter
    ✓ should retrieve regional offices when unit_types=2 is specified
  Scenario: Successful Data Retrieval with Multiple Filters
    ✓ should retrieve agencies and regional offices when unit_types=1,2 is specified
  Scenario: Unauthorized Access
    ✓ should return 401 Unauthorized when no valid JWT is provided
    ✓ should return 401 Unauthorized with invalid JWT token
  Scenario: Empty Data Set
    ✓ should return an empty array when no records match the filter
  Scenario: Invalid Query Parameter
    ✓ should return 400 for invalid unit_types
    ✓ should return 400 when unit_types contains mixed valid and invalid values
  Query Parameter Parsing
    ✓ should parse comma-separated unit_types values correctly
    ✓ should use default [1] when no unit_types is provided
    ✓ should handle single unit_types value
    ✓ should handle spaces in comma-separated values

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Coverage:    92.3% statements, 75% branches, 100% functions
```

### Test Examples

#### Test: Default Retrieval

```typescript
it('should retrieve agencies by default filter (unit_types=1)', async () => {
  mockUseCase.execute.mockResolvedValue([
    { org_unit_id: 102, org_unit_name: 'PCAARRD' },
    { org_unit_id: 103, org_unit_name: 'PCHRD' }
  ]);

  const response = await request(app)
    .get('/api/implementing-agency/unit-type')
    .set('Authorization', `Bearer ${generateTestToken()}`)
    .expect(200);

  expect(response.body.status).toBe(200);
  expect(response.body.data).toHaveLength(2);
});
```

#### Test: Invalid Parameters

```typescript
it('should return 400 for invalid unit_types', async () => {
  const response = await request(app)
    .get('/api/implementing-agency/unit-type?unit_types=abc')
    .set('Authorization', `Bearer ${generateTestToken()}`)
    .expect(400);

  expect(response.body.status).toBe(400);
  expect(response.body.message).toBe(
    'Invalid unit_types parameter. Must be comma-separated integers.'
  );
});
```

---

## Usage Examples

### cURL

**Default Retrieval:**
```bash
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json"
```

**Single Filter:**
```bash
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type?unit_types=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json"
```

**Multiple Filters:**
```bash
curl -X GET "http://localhost:3000/api/implementing-agency/unit-type?unit_types=1,2,3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json"
```

### JavaScript/Fetch API

```javascript
async function fetchAgencies(unitTypes = null) {
  const url = new URL('http://localhost:3000/api/implementing-agency/unit-type');
  
  if (unitTypes) {
    url.searchParams.append('unit_types', unitTypes);
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; // Return just the data array
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return [];
  }
}

// Usage
const agencies = await fetchAgencies(); // Default
const regionalOffices = await fetchAgencies('2');
const combined = await fetchAgencies('1,2');
```

### Python Requests

```python
import requests
from typing import List, Optional

def fetch_agencies(unit_types: Optional[str] = None) -> List[dict]:
    """
    Fetch implementing agencies filtered by unit type.
    
    Args:
        unit_types: Comma-separated unit type IDs (e.g., '1,2')
    
    Returns:
        List of agency dictionaries with org_unit_id and org_unit_name
    """
    url = 'http://localhost:3000/api/implementing-agency/unit-type'
    
    headers = {
        'Authorization': f'Bearer {jwt_token}',
        'Accept': 'application/json'
    }
    
    params = {}
    if unit_types:
        params['unit_types'] = unit_types
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data.get('data', [])
    except requests.exceptions.RequestException as error:
        print(f"Error fetching agencies: {error}")
        return []

# Usage
agencies = fetch_agencies()  # Default
regional_offices = fetch_agencies('2')
combined = fetch_agencies('1,2')
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';

interface Agency {
  org_unit_id: number;
  org_unit_name: string;
}

const AgencyList: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitTypes, setUnitTypes] = useState('1');

  useEffect(() => {
    fetchAgencies(unitTypes);
  }, [unitTypes]);

  const fetchAgencies = async (types: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL(`${API_BASE}/api/implementing-agency/unit-type`);
      if (types) {
        url.searchParams.append('unit_types', types);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setAgencies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label>
          Unit Type:
          <select value={unitTypes} onChange={(e) => setUnitTypes(e.target.value)}>
            <option value="1">Agencies</option>
            <option value="2">Regional Offices</option>
            <option value="1,2">Both</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {agencies.map((agency) => (
          <li key={agency.org_unit_id}>{agency.org_unit_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AgencyList;
```

---

## Performance & Limits

### Query Performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Average Response Time** | < 100ms | For typical queries with 10-50 results |
| **Max Query Size** | No limit | Database will handle appropriately |
| **Concurrent Requests** | No limit | Limited by server capacity |
| **Request Timeout** | 30 seconds | Server-side timeout |

### Database Optimization

- **Indexed Column:** `unit_type_id` is indexed for efficient filtering
- **Query Strategy:** Uses PostgreSQL `ANY()` operator for efficient multi-value filtering
- **Sorting:** Performed in database (ORDER BY org_unit_name)
- **No Pagination:** Results suitable for organizational hierarchies (typically 10-100 records)

### Recommendations

- Keep `unit_types` parameter to reasonable count (e.g., <= 10 values)
- Cache results on client side if frequently accessed
- Use pagination if adding to future versions
- Monitor query performance if dataset grows significantly

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: HTTP 401 Unauthorized

**Symptoms:**
- Response: `{ "status": 401, "message": "Unauthorized" }`
- Unable to access API

**Root Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing Authorization header | Add `Authorization: Bearer <token>` to request |
| Invalid/expired JWT token | Refresh JWT token from auth service |
| Malformed token | Verify token format: `Bearer eyJhbGc...` (no extra spaces) |
| JWT_SECRET mismatch | Verify JWT_SECRET environment variable matches auth service |

**Debug Steps:**
```bash
# 1. Verify token is not expired
jwt.io  # Paste token to decode

# 2. Check token format
echo "Token: $YOUR_TOKEN"
# Should start with "eyJ"

# 3. Test auth endpoint directly
curl -X POST https://your-auth-service/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### Issue 2: HTTP 400 Bad Request

**Symptoms:**
- Response: `{ "status": 400, "message": "Invalid unit_types parameter. Must be comma-separated integers." }`
- Invalid parameter format rejection

**Root Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Non-numeric characters | Use only digits and commas: `?unit_types=1,2,3` |
| Special characters | Remove spaces/symbols except commas |
| Negative numbers | Use positive integers only |
| Floating point | Use integers, not decimals |

**Examples:**

```
❌ INVALID:
?unit_types=abc          → No letters
?unit_types=1, 2 ABC     → No letters or spaces outside quotes
?unit_types=-1           → No negative numbers

✅ VALID:
?unit_types=1
?unit_types=1,2,3
?unit_types=1, 2, 3      → Spaces trimmed automatically
```

---

#### Issue 3: Empty Result (No Data)

**Symptoms:**
- Response: `{ "status": 200, "message": "No implementing agencies found.", "data": [] }`
- Unexpected empty array

**Root Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Invalid unit_type_id | Verify unit_type exists in database |
| parent_org_unit_id is NULL | API filters out top-level orgs |
| Data not yet loaded | Check database has been populated |
| Typo in unit_type value | double-check query parameter value |

**Debug Steps:**
```sql
-- Check if data exists in database
SELECT DISTINCT unit_type_id FROM tblorganizational_units;

-- Check specific unit type
SELECT COUNT(*) FROM tblorganizational_units 
WHERE unit_type_id = 1 AND parent_org_unit_id IS NOT NULL;

-- View sample records
SELECT * FROM tblorganizational_units 
WHERE unit_type_id = 1 
LIMIT 5;
```

---

#### Issue 4: HTTP 500 Internal Server Error

**Symptoms:**
- Response: `{ "status": 500, "message": "Internal server error" }`
- Random failures without clear error message
- Server logs show database errors

**Root Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Database connection failed | Check DB host, port, credentials in .env |
| Table doesn't exist | Verify tblorganizational_units table created |
| Missing environment variable | Check JWT_SECRET, DB_URL in .env |
| Database credentials wrong | Verify DATABASE_URL connection string |

**Debug Steps:**
```bash
# 1. Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# 2. Test database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tblorganizational_units;"

# 3. Check application logs
npm run dev  # See detailed error messages

# 4. Inspect server error response
curl -v http://localhost:3000/api/implementing-agency/unit-type
# Check server console for detailed error
```

**Recovery Procedure:**
1. Stop the service
2. Fix configuration (update .env)
3. Restart the service
4. Retry the request

---

### Performance Issues

**Issue:** Slow Response Times

**Solutions:**
1. Check database query performance:
   ```sql
   EXPLAIN ANALYZE 
   SELECT org_unit_id, org_unit_name FROM tblorganizational_units 
   WHERE unit_type_id = ANY('{1,2}') AND parent_org_unit_id IS NOT NULL;
   ```

2. Verify indexes exist:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'tblorganizational_units';
   ```

3. Monitor server resources (CPU, memory, disk)

4. Check network latency between client and server

---

### Monitoring Recommendations

**Metrics to Track:**

```
- API Response Time (p50, p95, p99)
- Error Rate (4xx, 5xx responses)
- Request Volume (RPM)
- Database Query Time
- JWT Token Validation Time
```

**Example Metrics Collection:**

```typescript
// Middleware for metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Send to monitoring service
    metrics.recordLatency('api.implementing-agency.unit-type', duration);
  });
  next();
});
```

---

## Related Documentation

- [Agency API Guide](AGENCY_API_GUIDE.md)
- [JWT Token Guide](JWT_TOKEN_GUIDE.md)
- [Organizational Unit List API](ORGANIZATIONAL_UNIT_LIST_API.md)
- [Unit Type API Guide](UNIT_TYPE_API_GUIDE.md)
- [User Org Unit Access Guide](USER-ORG-UNIT-ACCESS-GUIDE.md)

---

## Standards Compliance

### API Standards

✅ **RESTful Design**
- Uses HTTP methods appropriately (GET for retrieval)
- Resource-oriented endpoints
- Consistent URL structure

✅ **Response Format**
- Standardized JSON structure
- Consistent error format
- Clear status codes

✅ **Security**
- JWT authentication enforced
- Input validation
- SQL injection prevention

✅ **Documentation**
- OpenAPI 3.0 specification
- JSDoc code comments
- Usage examples provided

### Code Quality

✅ **TypeScript**
- Full type safety
- Interface definitions
- No implicit any types

✅ **Testing**
- 12 comprehensive tests
- 92.3% code coverage
- All acceptance criteria covered

✅ **Architecture**
- Clean architecture patterns
- Dependency injection
- Separation of concerns

---

## Document Metadata

| Property | Value |
|----------|-------|
| **Document Title** | Implementing Agency List API Documentation |
| **Version** | 1.0 |
| **Last Updated** | March 31, 2026 |
| **Status** | ✅ Production Ready |
| **Spec** | OpenAPI 3.0 |
| **Compliance** | ✅ PBI Requirement Met |
| **Maintenance** | Active - Updated with code changes |
| **Author** | Development Team |
| **Contact** | api.support@dost.gov.ph |

---

**End of Documentation**
