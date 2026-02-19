# Technical Documentation: Organizational Unit Creation Feature

## Overview
This document outlines the implementation of the **Create New Organizational Unit API** and the supporting authentication refactor [1, 5]. The goal was to enable system administrators to add new entities, such as regional offices or divisions, while ensuring the system reflects an accurate organizational structure [9, 10].

---

## 1. Technical Implementation

### Feature Development
* **Controller (`organizationalunitController.ts`):** Developed logic to handle the creation of new records in the `tblorganizational_units` table [107].
* **Routing (`organizationalunitRoutes.ts`):** Established a `POST` endpoint at `/api/organizational-units` to process incoming unit data [75, 76].
* **Data Integration:** The system now processes URL-encoded form data to populate fields such as unit name, description, type, and geographic coordinates [12, 110].

### Authentication Refactor
* **Stateless Transition:** Refactored `jwt.config.ts` to remove the auto-generation of `current_token.json` to ensure the service no longer relies on local file storage for authentication.
* **Microservice Compatibility:** Standardized JWT verification to accept tokens issued by the **User Profile microservice** [14]. This allows the Organizational Management service to verify administrator privileges using a shared secret [105].

---

## 2. API Specification

### Endpoint
`POST /api/organizational-units` [75, 76]

### Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| **Authorization** | `Bearer [your-jwt-token]` | Security token to authenticate the user [79]. |
| **Content-Type** | `application/x-www-form-urlencoded` | Required format for request body [15]. |
| **Accept** | `application/json` | Client expects a JSON response [79]. |

### Request Body Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `org_unit_name` | String | Name of the unit (e.g., "DOST Regional Office VI") [81]. |
| `unit_type_id` | Integer | ID representing the type of office [81]. |
| `parent_org_unit_id` | Integer | ID of the parent organizational unit [81]. |
| `region_id` | Integer | Geographic Region ID [81]. |
| `latitude` | String | Geographic latitude coordinate [85]. |
| `longitude` | String | Geographic longitude coordinate [85]. |

---

## 3. Usage Instructions

### Step 1: Authentication
Obtain a valid JWT by logging into the **User Profile microservice**. Ensure your account has **administrator privileges** as required by the user story [8, 14].

### Step 2: Postman Configuration
1. Set the request method to **POST** [76].
2. Enter the endpoint: `{{base_url}}/api/organizational-units` [75].
3. In the **Authorization** tab, select **Bearer Token** and paste your JWT [79].
4. In the **Body** tab, select `x-www-form-urlencoded` [15].

### Step 3: Execution
Enter the required parameters (e.g., `org_unit_name`, `region_id`) and click **Send**. 

### Expected Response
* **Success:** `201 Created` status with a JSON body containing the new `org_unit_id` [18, 20].
* **Failure:** `401 Unauthorized` if the user is not authenticated or has an invalid JWT [42, 45].