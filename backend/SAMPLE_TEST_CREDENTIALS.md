# 🔑 SAMPLE TEST CREDENTIALS

> **For Frontend Super Admin & Ward Admin Developers**

---

## ⚠️ IMPORTANT: Development Only
These are sample credentials for **development/testing purposes only**. 
For production, use secure credential generation.

---

## 👑 SUPER ADMIN

```json
{
  "email": "super_admin@councilapp.com",
  "password": "SuperAdmin@123",
  "role": "super_admin",
  "access_level": "All operations",
  "token_validity": "10 days"
}
```

**Login Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "super_admin@councilapp.com",
  "password": "SuperAdmin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIrOTEgOTg3NjU0MzIxMCIsIm5hbWUiOiJTdXBlciBBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiJ9.xxx",
    "user": {
      "id": 1,
      "phone": "+91 9876543210",
      "email": "super_admin@councilapp.com",
      "name": "Super Admin",
      "role": "super_admin",
      "ward_id": null
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

---

## 👨‍💼 WARD ADMIN #1

```json
{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123",
  "role": "councillor_admin",
  "ward": "Ward 15",
  "ward_id": 15,
  "access_level": "Ward-level operations",
  "token_validity": "10 days"
}
```

**Login Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJyYWplc2guLi4ifQ.xxx",
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

## 👨‍💼 WARD ADMIN #2

```json
{
  "email": "priya.kumar@wardadmin.com",
  "password": "WardAdmin@456",
  "role": "councillor_admin",
  "ward": "Ward 8",
  "ward_id": 8,
  "access_level": "Ward-level operations",
  "token_validity": "10 days"
}
```

**Login Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "priya.kumar@wardadmin.com",
  "password": "WardAdmin@456"
}
```

---

## 👤 CITIZEN (OTP Login)

```json
{
  "phone": "+91 9876543210",
  "otp": "123456",
  "role": "citizen",
  "access_level": "Self-only operations",
  "token_validity": "10 days"
}
```

**Step 1: Send OTP**
```bash
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "phone": "+91 9876543210"
}
```

**Step 2: Verify OTP**
```bash
POST http://localhost:3000/api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+91 9876543210",
  "otp": "123456"
}
```

---

## 📋 CREDENTIAL USAGE GUIDE

### Step 1: Login
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'rajesh.sharma@wardadmin.com',
    password: 'WardAdmin@123'
  })
});

const data = await response.json();
const token = data.data.token;
```

### Step 2: Store Token
```javascript
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(data.data.user));
localStorage.setItem('sessionExpiry', data.data.session_expiry);
```

### Step 3: Use Token in Requests
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/admin/users?role=citizen', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🔐 SECURITY NOTES

1. **Passwords are hashed** with bcryptjs
2. **Tokens expire in 10 days** automatically
3. **Never share** credentials in frontend code
4. **Use environment variables** in production
5. **HTTPS only** in production

---

## 🧪 TESTING CHECKLIST

### Super Admin Tests
- [ ] Login with email/password
- [ ] Get all citizens list
- [ ] Get citizen details
- [ ] View complaints from all wards
- [ ] Create announcements
- [ ] Manage categories

### Ward Admin Tests
- [ ] Login with email/password
- [ ] Get citizens in ward
- [ ] View ward complaints only
- [ ] Create ward announcements
- [ ] Get ward officers
- [ ] Get officers by category

### Citizen Tests
- [ ] Send OTP with phone
- [ ] Verify OTP
- [ ] Access personal data only

---

## 🆘 COMMON ISSUES

### "Invalid email or password"
- Check spelling of email
- Verify credentials from this document
- Ensure API is running on port 3000

### "Unauthorized"
- Token expired? Login again
- Token missing? Add `Authorization: Bearer <token>` header
- Invalidated token? Login with fresh credentials

### "User not found"
- Verify user ID in query parameter
- Check role has access to user

---

## 📞 SUPPORT

For issues or questions:
1. Check `COMPLETE_ENDPOINTS_REFERENCE.md`
2. Check `AUTH_API_DOCUMENTATION.md`
3. Review database setup instructions
4. Verify backend is running: `curl http://localhost:3000/health`

---

**Last Updated:** 2024-12-20
**Status:** ✅ Ready for Frontend Integration
