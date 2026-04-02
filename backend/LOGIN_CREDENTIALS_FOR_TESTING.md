# Frontend Integration - Auth API Quick Start

## 📋 Summary

The backend provides **3 authentication methods**:
1. **OTP-Based Login** - For citizens (phone-based)
2. **Email/Password Login** - For ward admins and super admins
3. **JWT Token Authorization** - For all protected API calls

---

## 🔑 Authentication Endpoints

### 1. Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+91 9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "data": { "otp": "123456" }
}
```

### 2. Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+91 9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "phone": "+91 9876543210",
      "name": "Amit Kumar",
      "role": "citizen",
      "ward_id": 8
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

### 3. Login with Email & Password
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
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

---

## 👥 Sample Test Credentials

### Super Admin
```
Email: super.admin@council.com
Password: SuperAdmin@123
Phone: +91 8888888888
Role: super_admin
```

**Login Command:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super.admin@council.com",
    "password": "SuperAdmin@123"
  }'
```

---

### Ward Admin 1
```
Email: rajesh.sharma@wardadmin.com
Password: WardAdmin@123
Phone: +91 9876543210
Role: councillor_admin
Ward: Ward 15
```

**Login Command:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh.sharma@wardadmin.com",
    "password": "WardAdmin@123"
  }'
```

---

### Ward Admin 2
```
Email: priya.desai@wardadmin.com
Password: WardAdmin@456
Phone: +91 9876543211
Role: councillor_admin
Ward: Ward 12
```

**Login Command:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya.desai@wardadmin.com",
    "password": "WardAdmin@456"
  }'
```

---

### Sample Citizen (OTP Login)
```
Phone: +91 9999999999
Name: Amit Kumar
Role: citizen
Ward: Ward 8
```

**Login Steps:**

Step 1 - Send OTP:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9999999999"
  }'
```

Step 2 - Verify OTP (check console for OTP in dev):
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9999999999",
    "otp": "123456"
  }'
```

---

## 💾 Database Setup for Test Credentials

Run these SQL commands to add test credentials:

```sql
-- Create Super Admin
INSERT INTO users (phone, email, name, role, password_hash, created_at)
VALUES (
  '+91 8888888888',
  'super.admin@council.com',
  'Super Admin',
  'super_admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.RR.RYLQDNbqpIe2yTxSsKKGfb8ZvHC',  -- bcrypt hash of "SuperAdmin@123"
  NOW()
);

-- Create Ward Admin 1
INSERT INTO users (phone, email, name, role, ward_id, password_hash, created_at)
VALUES (
  '+91 9876543210',
  'rajesh.sharma@wardadmin.com',
  'Rajesh Sharma',
  'councillor_admin',
  15,
  '$2a$10$O3VmgTrpLvHMDNqKGHm/Ju15KDzf/6TpQZYhfYZ1LMxqPRDQvUYKG',  -- bcrypt hash of "WardAdmin@123"
  NOW()
);

-- Create Ward Admin 2
INSERT INTO users (phone, email, name, role, ward_id, password_hash, created_at)
VALUES (
  '+91 9876543211',
  'priya.desai@wardadmin.com',
  'Priya Desai',
  'councillor_admin',
  12,
  '$2a$10$MJxVmb.bLYKUYvUWF2KU2.O0d/EzJM4v9IjWGu/kKdQZ/nU0WDu/m',  -- bcrypt hash of "WardAdmin@456"
  NOW()
);

-- Create Sample Citizen (OTP login)
INSERT INTO users (phone, name, role, ward_id, created_at)
VALUES (
  '+91 9999999999',
  'Amit Kumar',
  'citizen',
  8,
  NOW()
);
```

---

## 🚀 Frontend Implementation

### Step 1: Super Admin Login
```javascript
async function superAdminLogin() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'super.admin@council.com',
      password: 'SuperAdmin@123'
    })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    // Redirect to super admin dashboard
    window.location.href = '/super-admin/dashboard';
  }
}
```

### Step 2: Ward Admin Login
```javascript
async function wardAdminLogin() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'rajesh.sharma@wardadmin.com',
      password: 'WardAdmin@123'
    })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    // Redirect to ward admin dashboard
    window.location.href = '/ward-admin/dashboard';
  }
}
```

### Step 3: Citizen OTP Login
```javascript
// Step 1: Send OTP
async function sendOTP(phone) {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });

  const data = await response.json();
  if (data.success) {
    showOTPInputScreen();
  }
}

// Step 2: Verify OTP
async function verifyOTP(phone, otp) {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    // Redirect to citizen dashboard
    window.location.href = '/citizen/dashboard';
  }
}
```

### Step 4: Use Token in API Calls
```javascript
async function getCitizens() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/admin/users?role=citizen', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data.data;
}
```

---

## 🔒 Token Management

### Store Token
```javascript
localStorage.setItem('token', response.data.data.token);
```

### Send Token in Requests
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

### Clear Token on Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## ✅ Role-Based Access

### Super Admin Can:
- ✅ Manage all councillors
- ✅ Manage all wards
- ✅ View all users
- ✅ Create all announcements
- ✅ Assign ward admins

### Ward Admin Can:
- ✅ View citizens in their ward
- ✅ View complaints in their ward
- ✅ Create announcements
- ✅ Update complaint status
- ✅ Manage ward operations

### Citizen Can:
- ✅ File complaints
- ✅ View own complaints
- ✅ View profile
- ✅ Update profile

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Email and password are required" | Ensure both fields are sent in request body |
| "Invalid email or password" | Check credentials and database for user |
| "401 Unauthorized" | Include token in Authorization header |
| "Token expired" | Request new login to get fresh token |

---

**Base URL:** `http://localhost:3000/api`

**All endpoints, sample credentials, and code examples are ready for integration!**

For detailed documentation, see `AUTH_API_DOCUMENTATION.md`
