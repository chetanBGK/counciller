# Ward Admin Management - Complete Implementation Code

## 1. Service Methods (src/services/councillor.service.js)

### Promote Citizen to Ward Admin
```javascript
/**
 * Promote citizen to ward admin
 */
promoteToWardAdmin: async (councillorId, citizenId) => {
  // Get councillor's ward_id
  const councillorRes = await pool.query(
    'SELECT ward_id FROM users WHERE id = $1',
    [councillorId]
  );
  const councillorWardId = councillorRes.rows[0]?.ward_id;

  // Get citizen details
  const citizenRes = await pool.query(
    'SELECT id, ward_id, name, phone, email FROM users WHERE id = $1 AND role = \'citizen\'',
    [citizenId]
  );
  const citizen = citizenRes.rows[0];

  if (!citizen) {
    throw new Error('Citizen not found');
  }

  // Verify citizen is in the same ward as councillor
  if (String(citizen.ward_id) !== String(councillorWardId)) {
    throw new Error('Can only promote citizens from your ward');
  }

  // Generate random password (12 characters)
  const plainPassword = crypto.randomBytes(6).toString('hex').toUpperCase();
  const passwordHash = await authService.hashPassword(plainPassword);

  // Update user role and add password
  const updateRes = await pool.query(
    `UPDATE users 
     SET role = 'ward_admin', password_hash = $2 
     WHERE id = $1 
     RETURNING id, name, phone, email, role`,
    [citizenId, passwordHash]
  );

  const updatedUser = updateRes.rows[0];

  // Log audit
  await auditModel.log(councillorId, 'PROMOTE_TO_WARD_ADMIN', 'users', citizenId, null);

  return {
    user: updatedUser,
    temp_password: plainPassword,
    message: 'Share this password with the new Ward Admin for their first login'
  };
},
```

### Demote Ward Admin to Citizen
```javascript
/**
 * Demote ward admin to citizen
 */
demoteWardAdmin: async (councillorId, adminId) => {
  // Get councillor's ward_id
  const councillorRes = await pool.query(
    'SELECT ward_id FROM users WHERE id = $1',
    [councillorId]
  );
  const councillorWardId = councillorRes.rows[0]?.ward_id;

  // Get admin details
  const adminRes = await pool.query(
    'SELECT id, ward_id, name, phone, email FROM users WHERE id = $1 AND role = \'ward_admin\'',
    [adminId]
  );
  const admin = adminRes.rows[0];

  if (!admin) {
    throw new Error('Ward Admin not found');
  }

  // Verify admin is in the same ward as councillor
  if (String(admin.ward_id) !== String(councillorWardId)) {
    throw new Error('Can only demote admins from your ward');
  }

  // Update user role back to citizen and clear password
  const updateRes = await pool.query(
    `UPDATE users 
     SET role = 'citizen', password_hash = NULL 
     WHERE id = $1 
     RETURNING id, name, phone, email, role`,
    [adminId]
  );

  const updatedUser = updateRes.rows[0];

  // Log audit
  await auditModel.log(councillorId, 'DEMOTE_WARD_ADMIN', 'users', adminId, null);

  return {
    user: updatedUser,
    message: 'Ward Admin has been demoted to Citizen'
  };
},
```

---

## 2. Controller Methods (src/controllers/councillor.controller.js)

### Promote Controller
```javascript
export const promoteToWardAdmin = catchError(async (req, res) => {
  const councillorId = req.user.id;
  const { citizen_id } = req.body;

  if (!citizen_id) {
    return errorResponse(res, 'citizen_id is required', 400);
  }

  const result = await councillorService.promoteToWardAdmin(councillorId, citizen_id);
  return successResponse(res, result, 'Citizen promoted to Ward Admin');
});
```

### Demote Controller
```javascript
export const demoteWardAdmin = catchError(async (req, res) => {
  const councillorId = req.user.id;
  const { admin_id } = req.params;

  const result = await councillorService.demoteWardAdmin(councillorId, admin_id);
  return successResponse(res, result, 'Ward Admin demoted to Citizen');
});
```

---

## 3. Routes (src/routes/councillor.routes.js)

```javascript
// Promote citizen to ward admin and demote ward admin to citizen
router.post('/promote-citizen', 
  authMiddleware, 
  roleMiddleware('councillor', 'councillor_admin'), 
  councillorControllers.promoteToWardAdmin
);

router.delete('/ward-admin/:admin_id', 
  authMiddleware, 
  roleMiddleware('councillor', 'councillor_admin'), 
  councillorControllers.demoteWardAdmin
);
```

---

## 4. Required Imports

### In councillor.service.js
```javascript
import councillorModel from '../models/councillor.model.js';
import complaintModel from '../models/complaint.model.js';
import { notificationModel } from '../models/notification.model.js';
import auditModel from '../models/audit.model.js';
import authService from '../services/auth.service.js';  // NEW
import db from '../config/db.js';
import crypto from 'crypto';  // NEW
```

### In councillor.controller.js
```javascript
import { successResponse, errorResponse, catchError } from '../utils/response.js';
import councillorService from '../services/councillor.service.js';
```

### In councillor.routes.js
```javascript
import express from 'express';
import councillorControllers from '../controllers/councillor.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';
```

---

## 5. Database Schema Requirements

### Users Table Columns
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),  -- 'citizen', 'ward_admin', 'councillor', etc.
  ward_id INTEGER REFERENCES wards(id),
  password_hash VARCHAR(255),  -- NULL for citizens, bcrypt hash for ward_admins
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Audit Logs Table (for logging)
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100),  -- 'PROMOTE_TO_WARD_ADMIN', 'DEMOTE_WARD_ADMIN'
  table_name VARCHAR(100),  -- 'users'
  record_id INTEGER,
  performed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. SQL Queries Used

### Query 1: Get Councillor's Ward
```sql
SELECT ward_id FROM users WHERE id = $1
```

### Query 2: Get Citizen Details
```sql
SELECT id, ward_id, name, phone, email 
FROM users 
WHERE id = $1 AND role = 'citizen'
```

### Query 3: Promote User (Update Role and Add Password)
```sql
UPDATE users 
SET role = 'ward_admin', password_hash = $2 
WHERE id = $1 
RETURNING id, name, phone, email, role
```

### Query 4: Get Ward Admin Details
```sql
SELECT id, ward_id, name, phone, email 
FROM users 
WHERE id = $1 AND role = 'ward_admin'
```

### Query 5: Demote User (Change Role and Clear Password)
```sql
UPDATE users 
SET role = 'citizen', password_hash = NULL 
WHERE id = $1 
RETURNING id, name, phone, email, role
```

---

## 7. API Request/Response Examples

### Promotion Request
```bash
curl -X POST http://localhost:5000/api/councillor/promote-citizen \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_id": 50
  }'
```

### Promotion Response (201 Created)
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

### Demotion Request
```bash
curl -X DELETE http://localhost:5000/api/councillor/ward-admin/50 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Demotion Response (200 OK)
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

---

## 8. Error Handling Examples

### Error: Citizen Not Found
```json
{
  "success": false,
  "message": "Citizen not found"
}
```

### Error: Wrong Ward
```json
{
  "success": false,
  "message": "Can only promote citizens from your ward"
}
```

### Error: Missing citizen_id
```json
{
  "success": false,
  "message": "citizen_id is required"
}
```

### Error: Ward Admin Not Found
```json
{
  "success": false,
  "message": "Ward Admin not found"
}
```

---

## 9. Password Generation Algorithm

```javascript
// 1. Generate random bytes
const randomBytes = crypto.randomBytes(6);
// Output: <Buffer a1 b2 c3 d4 e5 f6> (or similar)

// 2. Convert to hex string and uppercase
const plainPassword = randomBytes.toString('hex').toUpperCase();
// Output: "A1B2C3D4E5F6"

// 3. Hash using bcrypt (10 salt rounds)
const passwordHash = await authService.hashPassword(plainPassword);
// Output: "$2b$10$abcdef..." (bcrypt hash)

// 4. Store hash in database, return plain password
// In Response: plainPassword
// In Database: passwordHash
```

---

## 10. Authentication Flow

```javascript
// 1. Client sends request with Bearer token
GET /api/councillor/promote-citizen
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 2. authMiddleware verifies token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Sets req.user = { id, phone, role, name, ... }

// 3. roleMiddleware checks role
if (!['councillor', 'councillor_admin'].includes(req.user.role)) {
  return res.status(403).send('Access denied');
}

// 4. Controller receives request with authenticated user
const councillorId = req.user.id;  // From token
const { citizen_id } = req.body;   // From request

// 5. Service method executes business logic
const result = await councillorService.promoteToWardAdmin(councillorId, citizen_id);

// 6. Response sent back
return successResponse(res, result, 'Citizen promoted to Ward Admin');
```

---

## 11. Testing with Node.js

```javascript
// Test script to verify promotion
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const token = 'YOUR_JWT_TOKEN';

async function testPromotion() {
  try {
    // Promote citizen
    const promoteRes = await axios.post(
      `${API_URL}/councillor/promote-citizen`,
      { citizen_id: 50 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Promotion Response:', promoteRes.data);
    const tempPassword = promoteRes.data.data.temp_password;

    // Demote ward admin
    const demoteRes = await axios.delete(
      `${API_URL}/councillor/ward-admin/50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Demotion Response:', demoteRes.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testPromotion();
```

---

## 12. Validation Checklist

- [x] Imports added (authService, crypto)
- [x] Service methods created with proper error handling
- [x] Controller methods created with response formatting
- [x] Routes added with proper middleware
- [x] Ward verification implemented
- [x] Password generation implemented
- [x] Password hashing implemented (bcrypt)
- [x] Audit logging implemented
- [x] Database updates correct
- [x] Response formats correct
- [x] Error handling implemented
- [x] Documentation complete

---

## Quick Start for Testing

1. **Get Councillor Token:**
   ```bash
   POST /auth/verify-otp
   {"phone": "9876543210", "otp": "123456"}
   ```

2. **Promote a Citizen:**
   ```bash
   POST /api/councillor/promote-citizen
   {"citizen_id": 50}
   ```
   Save the `temp_password` returned

3. **Verify in Database:**
   ```sql
   SELECT id, name, role, password_hash FROM users WHERE id = 50;
   -- Should show role = 'ward_admin' and password_hash is NOT NULL
   ```

4. **Demote the Ward Admin:**
   ```bash
   DELETE /api/councillor/ward-admin/50
   ```

5. **Verify in Database:**
   ```sql
   SELECT id, name, role, password_hash FROM users WHERE id = 50;
   -- Should show role = 'citizen' and password_hash is NULL
   ```

---

## Related Files
- Service: `src/services/councillor.service.js`
- Controller: `src/controllers/councillor.controller.js`
- Routes: `src/routes/councillor.routes.js`
- Documentation: `WARD_ADMIN_MANAGEMENT_API.md`
- Testing Guide: `WARD_ADMIN_TESTING_GUIDE.md`
- Implementation Summary: `WARD_ADMIN_IMPLEMENTATION_SUMMARY.md`
