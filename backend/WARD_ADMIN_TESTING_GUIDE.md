# Testing Ward Admin Management - Postman Guide

## Quick Start

### Prerequisites
- Postman installed
- API running on `http://localhost:5000`
- Councillor JWT token (from login)
- List of citizens in the ward (from GET /councillor/ward-citizens)

---

## Step-by-Step Testing

### Step 1: Get Councillor Token
**Request:** `POST /auth/verify-otp`
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response includes:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Councillor",
    "phone": "9876543210",
    "role": "councillor",
    "ward_id": 101
  }
}
```

**Save the token** as `{{councillor_token}}`

---

### Step 2: List Ward Citizens
Before promoting, view available citizens

**Request:**
```
GET http://localhost:5000/api/councillor/ward-citizens
Authorization: Bearer {{councillor_token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Ward citizens retrieved",
  "data": [
    {
      "citizen_id": 50,
      "name": "Alice Johnson",
      "phone": "9876543200",
      "email": "alice@example.com",
      "ward": "Ward 101",
      "city": "New York",
      "state": "NY",
      "voter_id": "NY1234567890"
    },
    {
      "citizen_id": 51,
      "name": "Bob Smith",
      "phone": "9876543201",
      "email": "bob@example.com",
      "ward": "Ward 101",
      "city": "New York",
      "state": "NY",
      "voter_id": "NY1234567891"
    }
  ]
}
```

**Note:** Save citizen_id (e.g., 50) to test promotion

---

### Step 3: Promote Citizen to Ward Admin

**Request:**
```
POST http://localhost:5000/api/councillor/promote-citizen
Authorization: Bearer {{councillor_token}}
Content-Type: application/json

{
  "citizen_id": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Citizen promoted to Ward Admin",
  "data": {
    "user": {
      "id": 50,
      "name": "Alice Johnson",
      "phone": "9876543200",
      "email": "alice@example.com",
      "role": "ward_admin"
    },
    "temp_password": "A1B2C3D4E5F6",
    "message": "Share this password with the new Ward Admin for their first login"
  }
}
```

⚠️ **IMPORTANT:** Copy the `temp_password` and share it with the new ward admin
- This password is shown ONLY ONCE
- It's used for first login to the ward admin panel
- Ward admin should change it after first login (future feature)

---

### Step 4: List Ward Admins
Verify the promotion worked

**Request:**
```
GET http://localhost:5000/api/councillor/ward-admins
Authorization: Bearer {{councillor_token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Ward admins retrieved",
  "data": [
    {
      "id": 50,
      "name": "Alice Johnson",
      "phone": "9876543200",
      "email": "alice@example.com",
      "role": "ward_admin",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

✓ Alice Johnson now appears as ward_admin

---

### Step 5: Ward Admin Login (Optional Test)
If ward admin panel is available, test login with:
- **Username:** 9876543200 (or email: alice@example.com)
- **Password:** A1B2C3D4E5F6 (the temp_password from step 3)

---

### Step 6: Demote Ward Admin Back to Citizen

**Request:**
```
DELETE http://localhost:5000/api/councillor/ward-admin/50
Authorization: Bearer {{councillor_token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Ward Admin demoted to Citizen",
  "data": {
    "user": {
      "id": 50,
      "name": "Alice Johnson",
      "phone": "9876543200",
      "email": "alice@example.com",
      "role": "citizen"
    },
    "message": "Ward Admin has been demoted to Citizen"
  }
}
```

✓ Role changed back to citizen

---

### Step 7: Verify Demotion
Check citizens list again

**Request:**
```
GET http://localhost:5000/api/councillor/ward-citizens?limit=50&offset=0
Authorization: Bearer {{councillor_token}}
```

**Expected:** Alice Johnson is back in citizens list with role "citizen"

---

## Postman Collection Template

Save this as `Ward_Admin_Management.postman_collection.json`:

```json
{
  "info": {
    "name": "Ward Admin Management",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Get Councillor Token",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{base_url}}/auth/verify-otp", "host": ["{{base_url}}"], "path": ["auth", "verify-otp"] },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone\": \"9876543210\",\n  \"otp\": \"123456\"\n}"
        }
      }
    },
    {
      "name": "2. List Ward Citizens",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{councillor_token}}" }
        ],
        "url": { "raw": "{{base_url}}/api/councillor/ward-citizens?limit=20&offset=0" }
      }
    },
    {
      "name": "3. Promote Citizen to Ward Admin",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{councillor_token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "url": { "raw": "{{base_url}}/api/councillor/promote-citizen" },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"citizen_id\": 50\n}"
        }
      }
    },
    {
      "name": "4. List Ward Admins",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{councillor_token}}" }
        ],
        "url": { "raw": "{{base_url}}/api/councillor/ward-admins" }
      }
    },
    {
      "name": "5. Demote Ward Admin",
      "request": {
        "method": "DELETE",
        "header": [
          { "key": "Authorization", "value": "Bearer {{councillor_token}}" }
        ],
        "url": { "raw": "{{base_url}}/api/councillor/ward-admin/50" }
      }
    }
  ],
  "variable": [
    { "key": "base_url", "value": "http://localhost:5000" },
    { "key": "councillor_token", "value": "" }
  ]
}
```

---

## Expected Behavior

### Successful Promotion
1. Citizen exists and is in the same ward as councillor ✓
2. Citizen's role changes to ward_admin ✓
3. Password hash is set in database ✓
4. Temporary password returned in response ✓
5. Audit log created ✓

### Successful Demotion
1. Ward admin exists and is in the same ward as councillor ✓
2. Ward admin's role changes back to citizen ✓
3. Password hash is cleared (NULL) ✓
4. Audit log created ✓

---

## Error Scenarios to Test

### Error 1: Promote Non-Existent Citizen
```json
{
  "citizen_id": 99999
}
```
**Expected:** 500 error - Citizen not found

### Error 2: Promote Citizen from Different Ward
- Use citizen_id from a different ward
**Expected:** 403 error - Can only promote citizens from your ward

### Error 3: Demote Non-Existent Ward Admin
```
DELETE /api/councillor/ward-admin/99999
```
**Expected:** 500 error - Ward Admin not found

### Error 4: Missing citizen_id
```json
{}
```
**Expected:** 400 error - citizen_id is required

---

## Debugging Tips

### Check User Role Changed
After promotion, query database:
```sql
SELECT id, name, role FROM users WHERE id = 50;
```
Expected output:
```
id  | name          | role
----+---------------+-----------
50  | Alice Johnson | ward_admin
```

### Verify Password Hash Exists
```sql
SELECT id, name, password_hash FROM users WHERE id = 50;
```
Expected: password_hash is NOT NULL (bcrypt hash)

### Check Audit Log
```sql
SELECT * FROM audit_logs WHERE action = 'PROMOTE_TO_WARD_ADMIN' ORDER BY created_at DESC LIMIT 1;
```

### Verify After Demotion
```sql
SELECT id, name, role, password_hash FROM users WHERE id = 50;
```
Expected: role = 'citizen', password_hash = NULL

---

## Notes

- ✓ Promotion and demotion use Ward Admin role name: `ward_admin`
- ✓ Passwords are bcrypt hashed (10 salt rounds)
- ✓ Plain password shown only once at promotion
- ✓ Same ward verification prevents unauthorized promotions
- ✓ Audit logs track all promotion/demotion operations
- ⚠️ Test with actual database to verify all changes persist

---

## Related Documentation
- [Ward Admin Management API](./WARD_ADMIN_MANAGEMENT_API.md)
- [Councillor API Documentation](./COUNCILLOR_API_DOCUMENTATION.md)
- [Login Credentials for Testing](./LOGIN_CREDENTIALS_FOR_TESTING.md)
