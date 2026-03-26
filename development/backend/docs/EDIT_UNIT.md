# Update Unit API

Endpoint
# PUT /api/units/:unit_id

# Purpose
To update the information of an existing organizational unit within the system. This endpoint supports changing the unit name, assigning a new receiving officer, and synchronizing the list of unit members. It utilizes Kafka integration to fetch detailed member profiles from the User Backend.

# Authentication
Requires a valid JWT token. The authenticated user must have administrative privileges to modify unit data.

## Possible API Returns

## Success - Unit Updated (200 OK)
Returns updated unit details with an enriched member list retrieved via Kafka.

```json
    {
    "status": 200,
    "message": "Unit updated successfully",
    "data": {
        "unit_id": 501,
        "name": "IT Unit",
        "org_unit_id": 1,
        "receiving_officer_id": 1,
        "members": {
        "count": 2,
        "list": [
            { "user_id": 1, "first_name": "John", "last_name": "Doe", "avatar": null },
            { "user_id": 124, "first_name": "Jane", "last_name": "Smith", "avatar": null }
        ]
        },
        "updated_at": "2026-03-26T10:15:00Z",
        "updated_by": 100
    }
    }
 ```

 ## Missing Required Fields (400 Bad Request)
 Returned when mandatory fields are missing or the members array is empty.
```json
 {
  "status": 400,
  "message": "Missing required fields",
  "data": {}
 }
```


## Unit Not Found (404 Not Found)
Returned when the provided unit_id does not exist in the database.
```json
    {
    "status": 404,
    "message": "Unit not found",
    "data": {}
    }
```

## Duplicate Unit Name (409 Conflict)
Returned when the new name is already taken by another unit.
```json
    {
    "status": 409,
    "message": "Unit name already exists",
    "data": {}
    }
```
















