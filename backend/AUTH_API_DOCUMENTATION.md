# Login/Auth API - Complete Documentation

## Available Authentication Methods

The system supports **two authentication methods**:

1. **OTP-Based Login** - For citizens and users without pre-assigned credentials
2. **Email/Password Login** - For ward admins assigned by councillors

---

## Method 1: OTP-Based Login

### Endpoint 1: Send OTP
```
POST /api/auth/send-otp
```

**Headers:**
```
Content-Type: application/json
```

**Request Schema:**
```json
{
  "phone": "string (required) - Phone number with country code"
}
```

**Request Example:**
```json
{
  "phone": "+91 9876543210"
}
```

**Response Schema (Success - 200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "string - 6 digit OTP"
  }
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "456789"
  }
}
```

**Response Schema (Error - 400):**
```json
{
  "success": false,
  "message": "Error description"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9876543210"
  }'
```

---

### Endpoint 2: Verify OTP
```
POST /api/auth/verify-otp
```

**Headers:**
```
Content-Type: application/json
```

**Request Schema:**
```json
{
  "phone": "string (required) - Phone number with country code",
  "otp": "string (required) - 6 digit OTP received"
}
```

**Request Example:**
```json
{
  "phone": "+91 9876543210",
  "otp": "456789"
}
```

**Response Schema (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string - JWT Bearer token",
    "user": {
      "id": "number - User ID",
      "phone": "string - Phone number",
      "email": "string or null - Email",
      "name": "string or null - User name",
      "role": "string - User role (citizen, councillor, councillor_admin, super_admin)",
      "ward_id": "number or null - Assigned ward ID"
    },
    "session_expiry": "string - ISO datetime when token expires"
  }
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiTywiOiIrOTEgOTg3NjU0MzIxMCIsInJvbGUiOiJjaXRpemVuIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "user": {
      "id": 1,
      "phone": "+91 9876543210",
      "email": null,
      "name": "Rajesh Sharma",
      "role": "citizen",
      "ward_id": 15
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

**Response Schema (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9876543210",
    "otp": "456789"
  }'
```

---

## Method 2: Email/Password Login (For Ward Admins)

### Endpoint 3: Login with Email & Password
```
POST /api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Schema:**
```json
{
  "email": "string (required) - Email address",
  "password": "string (required) - Password"
}
```

**Request Example:**
```json
{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "SecurePassword@123"
}
```

**Response Schema (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string - JWT Bearer token",
    "user": {
      "id": "number - User ID",
      "phone": "string - Phone number",
      "email": "string - Email address",
      "name": "string - User name",
      "role": "string - User role",
      "ward_id": "number - Assigned ward ID"
    },
    "session_expiry": "string - ISO datetime when token expires"
  }
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrOTEgOTg3NjU0MzIxMCIsImVtYWlsIjoicmFqZXNoLnNoYXJtYUB3YXJkYWRtaW4uY29tIiwicm9sZSI6ImNvdW5jaWxsb3JfYWRtaW4ifQ.abc123xyz",
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

**Response Schema (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh.sharma@wardadmin.com",
    "password": "SecurePassword@123"
  }'
```

---

## Using Authentication Token

### Token Format
```
Authorization: Bearer <JWT_TOKEN>
```

### Example API Call with Token
```bash
curl -X GET http://localhost:3000/api/admin/users?role=citizen \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrOTEgOTg3NjU0MzIxMCIsImVtYWlsIjoicmFqZXNoLnNoYXJtYUB3YXJkYWRtaW4uY29tIiwicm9sZSI6ImNvdW5jaWxsb3JfYWRtaW4ifQ.abc123xyz"
```

### Token Expiry
- **Validity**: 10 days
- **Refresh**: Request new login when token expires
- **Storage**: Store in localStorage or sessionStorage on frontend

---

# Sample Test Credentials

## Super Admin

### Credentials
```
Email: super.admin@council.com
Password: SuperAdmin@123
Phone: +91 8888888888
```

### Login Steps

**Step 1: Send OTP (if needed)**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 8888888888"
  }'
```

**Step 2: Login with Email & Password**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super.admin@council.com",
    "password": "SuperAdmin@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "+91 8888888888",
      "email": "super.admin@council.com",
      "name": "Super Admin",
      "role": "super_admin",
      "ward_id": null
    },
    "session_expiry": "2026-01-23T14:30:00Z"
  }
}
```

### Access Level
- ✅ Manage all councillors
- ✅ Manage all wards
- ✅ Manage all users
- ✅ View all complaints
- ✅ Create announcements/events
- ✅ Assign ward admins

---

## Ward Admin 1

### Credentials
```
Email: rajesh.sharma@wardadmin.com
Password: WardAdmin@123
Phone: +91 9876543210
Ward: Ward 15
```

### Login Steps

**Login with Email & Password**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh.sharma@wardadmin.com",
    "password": "WardAdmin@123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "phone": "+91 9876543210",
      "email": "rajesh.sharma@wardadmin.com",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15
    },
    "session_expiry": "2026-01-23T14:30:00Z"
  }
}
```

### Access Level
- ✅ View citizens in Ward 15
- ✅ View complaints in Ward 15
- ✅ Create announcements/events
- ✅ View officers
- ✅ Update complaint status

---

## Ward Admin 2

### Credentials
```
Email: priya.desai@wardadmin.com
Password: WardAdmin@456
Phone: +91 9876543211
Ward: Ward 12
```

### Login Steps

**Login with Email & Password**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya.desai@wardadmin.com",
    "password": "WardAdmin@456"
  }'
```

### Access Level
- ✅ View citizens in Ward 12
- ✅ View complaints in Ward 12
- ✅ Create announcements/events
- ✅ View officers
- ✅ Update complaint status

---

## Sample Citizen (OTP Login)

### Credentials
```
Phone: +91 9999999999
Name: Amit Kumar
Role: citizen
Ward: Ward 8
```

### Login Steps

**Step 1: Send OTP**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9999999999"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}
```

**Step 2: Verify OTP**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9999999999",
    "otp": "123456"
  }'
```

### Access Level
- ✅ File complaints
- ✅ View own complaints
- ✅ View profile
- ❌ Access ward admin features

---

# Testing Checklist

## Setup Database Test Data

### Create Super Admin (Run once)
```sql
INSERT INTO users (phone, email, name, role, password_hash, created_at)
VALUES (
  '+91 8888888888',
  'super.admin@council.com',
  'Super Admin',
  'super_admin',
  '$2a$10$...',  -- Hash of "SuperAdmin@123"
  NOW()
);
```

### Create Ward Admins (Run once)
```sql
INSERT INTO users (phone, email, name, role, ward_id, password_hash, created_at)
VALUES 
(
  '+91 9876543210',
  'rajesh.sharma@wardadmin.com',
  'Rajesh Sharma',
  'councillor_admin',
  15,
  '$2a$10$...',  -- Hash of "WardAdmin@123"
  NOW()
),
(
  '+91 9876543211',
  'priya.desai@wardadmin.com',
  'Priya Desai',
  'councillor_admin',
  12,
  '$2a$10$...',  -- Hash of "WardAdmin@456"
  NOW()
);
```

## Frontend Testing Workflow

### Test 1: Super Admin Login
```javascript
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'super.admin@council.com',
    password: 'SuperAdmin@123'
  })
});

const { data } = await loginResponse.json();
localStorage.setItem('token', data.token);
// Redirect to super admin dashboard
```

### Test 2: Ward Admin Login
```javascript
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'rajesh.sharma@wardadmin.com',
    password: 'WardAdmin@123'
  })
});

const { data } = await loginResponse.json();
localStorage.setItem('token', data.token);
// Redirect to ward admin dashboard
```

### Test 3: Citizen OTP Login
```javascript
// Step 1: Send OTP
await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+91 9999999999' })
});

// Step 2: Verify OTP
const loginResponse = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+91 9999999999',
    otp: '123456'
  })
});

const { data } = await loginResponse.json();
localStorage.setItem('token', data.token);
// Redirect to citizen dashboard
```

---

# Error Responses

## Common Errors

### Missing Required Fields
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Expired OTP
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

### Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Unauthorized - Token required"
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

# Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/send-otp | No | Send OTP via SMS |
| POST | /api/auth/verify-otp | No | Verify OTP & login |
| POST | /api/auth/login | No | Login with email/password |
| GET | /api/admin/users | Yes | List citizens |
| GET | /api/admin/userdetails | Yes | Get citizen details |
| GET | /api/officers | Yes | List officers |

---

# Important Notes

1. **Passwords**: Stored securely using bcrypt hashing
2. **Token**: Store in localStorage or sessionStorage
3. **Token Expiry**: 10 days from login
4. **HTTPS**: Use HTTPS in production
5. **CORS**: Configure CORS for frontend domain
6. **Rate Limiting**: Implement rate limiting for auth endpoints

---

**Last Updated**: January 13, 2026
