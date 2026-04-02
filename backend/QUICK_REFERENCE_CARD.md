# 🔐 AUTHENTICATION API - QUICK REFERENCE CARD

## BASE URL
```
http://localhost:3000/api
```

---

## 📱 ENDPOINTS

### 1️⃣ OTP LOGIN (Citizens)

**Send OTP:**
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+91 9876543210"
}
```

**Verify OTP:**
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+91 9876543210",
  "otp": "123456"
}
```

---

### 2️⃣ EMAIL/PASSWORD LOGIN (Admins)

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}
```

---

## 👤 TEST CREDENTIALS

### Super Admin
```
Email:    super.admin@council.com
Password: SuperAdmin@123
Phone:    +91 8888888888
Role:     super_admin
```

### Ward Admin 1
```
Email:    rajesh.sharma@wardadmin.com
Password: WardAdmin@123
Phone:    +91 9876543210
Ward:     15
Role:     councillor_admin
```

### Ward Admin 2
```
Email:    priya.desai@wardadmin.com
Password: WardAdmin@456
Phone:    +91 9876543211
Ward:     12
Role:     councillor_admin
```

### Citizen (OTP Login)
```
Phone: +91 9999999999
Name:  Amit Kumar
Role:  citizen
Ward:  8
```

---

## 🎯 RESPONSE FORMAT

**Success:**
```json
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

**Error:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🔑 TOKEN USAGE

**Add to all API requests:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/admin/users?role=citizen
```

---

## 💾 TOKEN STORAGE

```javascript
// Store after login
localStorage.setItem('token', data.data.token);
localStorage.setItem('user', JSON.stringify(data.data.user));

// Use in requests
fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Clear on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## ✅ TOKEN DETAILS

| Property | Value |
|----------|-------|
| Validity | 10 days |
| Type | JWT |
| Algorithm | HS256 |
| Refresh | Login again when expired |
| Storage | localStorage or sessionStorage |

---

## 🚀 QUICK TEST

**Test Super Admin Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super.admin@council.com",
    "password": "SuperAdmin@123"
  }'
```

**Test Ward Admin Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh.sharma@wardadmin.com",
    "password": "WardAdmin@123"
  }'
```

**Test Citizen OTP:**
```bash
# Step 1
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+91 9999999999"}'

# Step 2 (use OTP from response)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9999999999",
    "otp": "123456"
  }'
```

---

## 🎭 ROLE-BASED ACCESS

| Role | Citizens | Complaints | Events | Officers |
|------|----------|-----------|--------|----------|
| super_admin | ✅ All | ✅ All | ✅ Create | ✅ All |
| councillor_admin | ✅ Ward | ✅ Ward | ✅ Create | ✅ View |
| citizen | ✅ Self | ✅ Own | ❌ | ✅ View |

---

## ⚠️ COMMON ERRORS

| Error | Solution |
|-------|----------|
| "Email and password are required" | Include both in body |
| "Invalid email or password" | Check DB for user |
| "Invalid or expired OTP" | Request new OTP |
| "401 Unauthorized" | Include token header |
| "Token expired" | Login again |

---

**READY FOR FRONTEND INTEGRATION** ✅

For detailed docs: See `AUTH_API_DOCUMENTATION.md`
