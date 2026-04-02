# Ward Admin Management API Documentation

## Overview
Councillors can promote citizens to ward admin role and demote them back to citizen role. When a citizen is promoted, a temporary password is generated for them to use on the ward admin panel.

---

## Endpoints

### 1. Promote Citizen to Ward Admin
**Endpoint:** `POST /councillor/promote-citizen`

**Authentication:** Required (Bearer Token)
- Role: Councillor only

**Request Body:**
```json
{
  "citizen_id": 123
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Citizen promoted to Ward Admin",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "role": "ward_admin"
    },
    "temp_password": "A1B2C3D4E5F6",
    "message": "Share this password with the new Ward Admin for their first login"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing citizen_id
- `404 Not Found` - Citizen not found or not a citizen role
- `403 Forbidden` - Citizen is from a different ward
- `500 Internal Server Error` - Database error

**Important Notes:**
- The `temp_password` is returned in plain text ONLY at promotion time
- Share this password securely with the new ward admin
- Password is hashed in database using bcrypt
- Citizen must be in the same ward as the councillor
- The citizen's role is changed from "citizen" to "ward_admin"

---

### 2. Demote Ward Admin to Citizen
**Endpoint:** `DELETE /councillor/ward-admin/:admin_id`

**Authentication:** Required (Bearer Token)
- Role: Councillor only

**URL Parameters:**
```
admin_id: 456 (ID of the ward admin to demote)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Ward Admin demoted to Citizen",
  "data": {
    "user": {
      "id": 456,
      "name": "Jane Smith",
      "phone": "9876543211",
      "email": "jane@example.com",
      "role": "citizen"
    },
    "message": "Ward Admin has been demoted to Citizen"
  }
}
```

**Error Responses:**
- `404 Not Found` - Ward admin not found or not in ward_admin role
- `403 Forbidden` - Ward admin is from a different ward
- `500 Internal Server Error` - Database error

**Important Notes:**
- The admin's role is changed from "ward_admin" to "citizen"
- Password hash is cleared (set to NULL)
- Ward admin loses access to the ward admin panel
- Can be re-promoted later if needed

---

## Database Changes

### Users Table
Required columns for ward admin functionality:
- `id` - Primary key
- `role` - User role (citizen, councillor, ward_admin, officer, operator)
- `ward_id` - Foreign key to wards table
- `name` - User name
- `phone` - User phone (UNIQUE)
- `email` - User email
- `password_hash` - Bcrypt hashed password (NULL for citizens)

### Audit Logging
Both promotion and demotion operations are logged in the audit table:
- Action: `PROMOTE_TO_WARD_ADMIN` or `DEMOTE_WARD_ADMIN`
- Performed by: Councillor ID
- Target: Citizen/Admin ID
- Timestamp: Automatically recorded

---

## Example Usage

### Step 1: List Ward Citizens
```bash
GET /councillor/ward-citizens
Authorization: Bearer <token>
```

### Step 2: Promote a Citizen
```bash
POST /councillor/promote-citizen
Authorization: Bearer <token>
Content-Type: application/json

{
  "citizen_id": 123
}
```

**Response includes:**
- New ward admin's details
- Temporary password (e.g., "A1B2C3D4E5F6")

### Step 3: Share Password with Ward Admin
Give the ward admin the temporary password to login to the ward admin panel

### Step 4: List Ward Admins
```bash
GET /councillor/ward-admins
Authorization: Bearer <token>
```

### Step 5: Demote Ward Admin (if needed)
```bash
DELETE /councillor/ward-admin/456
Authorization: Bearer <token>
```

---

## Password Management

### For Ward Admin Login
Ward admins use password-based authentication:
- Username: Phone number or email
- Password: Temporary password (plain text only shown at promotion)

### Password Security
- Passwords are hashed using bcrypt with salt of 10
- Plain text password is NEVER stored
- Plain text password shown ONLY once at promotion time
- Recommend password change on first login

### Password Reset (Not Yet Implemented)
Future feature: "Forgot Password" for ward admins

---

## Authorization Matrix

| Operation | Citizen | Councillor | Ward Admin | Officer | Operator | Super Admin |
|-----------|---------|-----------|-----------|---------|----------|-------------|
| Promote Citizen | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Demote Ward Admin | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| List Ward Citizens | ✗ | ✓ | - | - | - | ✓ |
| List Ward Admins | ✗ | ✓ | - | - | - | ✓ |

---

## Workflow Examples

### Scenario 1: Promote New Ward Admin
1. Councillor views list of citizens in their ward
2. Councillor identifies suitable citizen for ward admin role
3. Councillor calls promote endpoint with citizen_id
4. System generates temporary password and returns it
5. Councillor shares password with the citizen
6. Citizen logs in with password and can use ward admin panel

### Scenario 2: Remove Existing Ward Admin
1. Councillor views list of ward admins
2. Councillor decides to demote a ward admin
3. Councillor calls demote endpoint with admin_id
4. System changes role back to citizen and clears password
5. Ward admin loses access to ward admin panel immediately

---

## Testing with Postman

### Collection Setup
```json
{
  "variables": [
    {
      "key": "councillor_token",
      "value": "your_jwt_token_here"
    },
    {
      "key": "citizen_id",
      "value": "123"
    },
    {
      "key": "admin_id",
      "value": "456"
    }
  ]
}
```

### Test 1: Promote Citizen
```
POST http://localhost:5000/api/councillor/promote-citizen
Authorization: Bearer {{councillor_token}}
Content-Type: application/json

{
  "citizen_id": {{citizen_id}}
}
```

### Test 2: Demote Ward Admin
```
DELETE http://localhost:5000/api/councillor/ward-admin/{{admin_id}}
Authorization: Bearer {{councillor_token}}
```

---

## Error Handling

### Common Errors

**Error: Citizen not found**
```json
{
  "success": false,
  "message": "Citizen not found"
}
```
**Solution:** Verify citizen_id is correct and citizen exists in system

**Error: Can only promote citizens from your ward**
```json
{
  "success": false,
  "message": "Can only promote citizens from your ward"
}
```
**Solution:** Only citizens from your ward can be promoted. Check ward_id

**Error: Ward Admin not found**
```json
{
  "success": false,
  "message": "Ward Admin not found"
}
```
**Solution:** Verify admin_id is correct and user is a ward_admin role

---

## Related Documentation
- [Councillor API Documentation](./COUNCILLOR_API_DOCUMENTATION.md)
- [Citizen API Documentation](./CITIZEN_API_DOCUMENTATION.md)
- [Ward Management Guide](./WARD_MANAGEMENT_GUIDE.md)
