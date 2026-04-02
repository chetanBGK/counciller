# ✅ HOW TEST CREDENTIALS WORK - Technical Explanation

**Short Answer:** Yes, they will work IF you run the database setup SQL commands first.

---

## 🎯 The Process (Step by Step)

### Step 1: Setup Database Users
First, you need to run these SQL commands in your PostgreSQL database:

```sql
-- Super Admin
INSERT INTO users (phone, email, name, role, password_hash, created_at)
VALUES (
  '+91 8888888888',
  'super_admin@councilapp.com',
  'Super Admin',
  'super_admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.RR.RYLQDNbqpIe2yTxSsKKGfb8ZvHC',
  NOW()
);

-- Ward Admin 1
INSERT INTO users (phone, email, name, role, ward_id, password_hash, created_at)
VALUES (
  '+91 9876543210',
  'rajesh.sharma@wardadmin.com',
  'Rajesh Sharma',
  'councillor_admin',
  15,
  '$2a$10$O3VmgTrpLvHMDNqKGHm/Ju15KDzf/6TpQZYhfYZ1LMxqPRDQvUYKG',
  NOW()
);

-- Ward Admin 2
INSERT INTO users (phone, email, name, role, ward_id, password_hash, created_at)
VALUES (
  '+91 9876543211',
  'priya.kumar@wardadmin.com',
  'Priya Kumar',
  'councillor_admin',
  8,
  '$2a$10$MJxVmb.bLYKUYvUWF2KU2.O0d/EzJM4v9IjWGu/kKdQZ/nU0WDu/m',
  NOW()
);
```

### Step 2: How Authentication Works

When you login with email & password:

```
User Input: email + password
    ↓
POST /api/auth/login
    ↓
Backend:
  1. Find user by email in database
  2. Get stored password_hash from database
  3. Compare user's password with stored hash using bcryptjs
  4. If match → Generate JWT token
  5. If no match → Return "Invalid email or password"
    ↓
Response: JWT token (valid for 10 days)
```

### Step 3: Use Token in Requests

```javascript
// After login
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Send with Authorization header
fetch('http://localhost:3000/api/admin/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🔐 Password Hashing - The Security Part

### What's a bcrypt hash?
It's a one-way encryption. You **cannot** reverse it to get the original password.

**Example:**
```
Password: "WardAdmin@123"
Hash:     "$2a$10$O3VmgTrpLvHMDNqKGHm/Ju15KDzf/6TpQZYhfYZ1LMxqPRDQvUYKG"
```

### How bcryptjs Verification Works:

```javascript
import bcrypt from 'bcryptjs';

// During login
const userInputPassword = "WardAdmin@123";
const storedHash = "$2a$10$O3VmgTrpLvHMDNqKGHm/Ju15KDzf/6TpQZYhfYZ1LMxqPRDQvUYKG";

// Backend compares them
const isMatch = await bcrypt.compare(userInputPassword, storedHash);
// isMatch = true ✅

// If user enters wrong password
const wrongPassword = "WrongPassword";
const isMatch = await bcrypt.compare(wrongPassword, storedHash);
// isMatch = false ❌
```

---

## 📊 Database Flow

### Users Table Structure:
```
id    | phone          | email                      | name           | role             | password_hash                                          | created_at
------|----------------|----------------------------|----------------|------------------|---------------------------------------------------------|----------
1     | +91 8888888888 | super_admin@councilapp.com | Super Admin    | super_admin      | $2a$10$N9qo8uLOickgx2ZMRZoMye.RR.RYLQDNbqpI...       | 2026-01-13
5     | +91 9876543210 | rajesh.sharma@wardadmin.com| Rajesh Sharma  | councillor_admin | $2a$10$O3VmgTrpLvHMDNqKGHm/Ju15KDzf/6TpQZYhf...      | 2026-01-13
6     | +91 9876543211 | priya.kumar@wardadmin.com  | Priya Kumar    | councillor_admin | $2a$10$MJxVmb.bLYKUYvUWF2KU2.O0d/EzJM4v9IjWGu/...      | 2026-01-13
```

### Login Query:
```sql
-- Backend executes this
SELECT * FROM users 
WHERE email = 'rajesh.sharma@wardadmin.com' 
LIMIT 1;

-- Returns the user row with password_hash
-- Then compares the password with the hash
```

---

## ✅ Complete Login Example

### 1. Request
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}
```

### 2. Backend Processing
```
Check: User "rajesh.sharma@wardadmin.com" exists? ✅ YES
Check: Password "WardAdmin@123" matches hash? ✅ YES
  → bcrypt.compare("WardAdmin@123", storedHash) = true
Generate JWT token
Update session_expiry to 10 days from now
```

### 3. Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrOTEgOTg3NjU0MzIxMCIsIm5hbWUiOiJSYWplc2ggU2hhcm1hIiwicm9sZSI6ImNvdW5jaWxsb3JfYWRtaW4ifQ.xxx",
    "user": {
      "id": 5,
      "phone": "+91 9876543210",
      "email": "rajesh.sharma@wardadmin.com",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

### 4. Use Token
```javascript
const token = response.data.token;

// In next API calls
fetch('http://localhost:3000/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🧪 Testing Checklist

### What You Need to Do:

✅ **Step 1:** Run backend server
```bash
cd c:\Spw Project\backend
npm start
```

✅ **Step 2:** Run the SQL setup commands
```sql
-- Run in PostgreSQL database
-- See commands above
```

✅ **Step 3:** Test login with credentials
```javascript
// Try this in Postman or fetch
POST http://localhost:3000/api/auth/login
{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}

// Should return JWT token ✅
```

✅ **Step 4:** Use token in other endpoints
```javascript
// Get citizens with token
GET http://localhost:3000/api/admin/users?role=citizen
Authorization: Bearer <token_from_step_3>

// Should return list of citizens ✅
```

---

## 🎯 Credentials Summary

| Role | Email | Password | How to Test |
|------|-------|----------|------------|
| Super Admin | `super_admin@councilapp.com` | `SuperAdmin@123` | Run SQL insert, then login |
| Ward Admin 1 | `rajesh.sharma@wardadmin.com` | `WardAdmin@123` | Run SQL insert, then login |
| Ward Admin 2 | `priya.kumar@wardadmin.com` | `WardAdmin@456` | Run SQL insert, then login |
| Citizen | `+91 9876543210` | OTP (send to phone) | Send OTP, verify with code |

---

## ❌ Common Issues & Solutions

### Issue 1: "Invalid email or password"
**Cause:** User not in database yet
**Solution:** Run the SQL INSERT commands first

### Issue 2: "User not found"
**Cause:** Email doesn't exist in database
**Solution:** Check spelling, ensure INSERT command ran successfully

### Issue 3: "Token expired"
**Cause:** Token older than 10 days
**Solution:** Login again to get new token

### Issue 4: "Unauthorized"
**Cause:** Missing or invalid token in Authorization header
**Solution:** Make sure you include: `Authorization: Bearer <token>`

---

## 📁 Files You Need

1. **Backend Running:**
   ```bash
   npm start
   ```
   Server on port 3000 ✅

2. **Database Setup:**
   Run SQL commands in PostgreSQL ✅

3. **Test Credentials:**
   From SAMPLE_TEST_CREDENTIALS.md ✅

4. **API Endpoints:**
   From COMPLETE_ENDPOINTS_REFERENCE.md ✅

---

## 🔍 Code References

**Authentication Logic:**
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js) - Handles login requests
- [src/services/auth.service.js](src/services/auth.service.js) - Password verification using bcryptjs

**Key Functions:**
```javascript
// File: src/services/auth.service.js

// 1. Compare password with hash
authService.comparePassword(password, hash)
  → Uses bcryptjs.compare()
  → Returns true/false

// 2. Generate JWT token
authService.generateToken(user)
  → Creates JWT with 10-day expiry
  → Signed with JWT_SECRET

// 3. Email login
authService.loginWithEmail(email, password)
  → Finds user by email
  → Verifies password
  → Returns token
```

---

## ✨ Summary

**Yes, the credentials WILL work IF:**

1. ✅ Backend server is running (port 3000)
2. ✅ PostgreSQL database is running
3. ✅ SQL INSERT commands have been executed
4. ✅ Users exist in the users table with correct password hashes

**Then:**
- Login will work ✅
- JWT token will be generated ✅
- Token can be used in other API calls ✅
- All protected endpoints will work ✅

---

**Created:** 2026-01-13  
**Status:** ✅ Ready for Testing
