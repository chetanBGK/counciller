# 🎯 FRONTEND DEVELOPERS - AUTH API SUMMARY

**Prepared for:** Super Admin Developers & Ward Admin Developers  
**Date:** January 13, 2026  
**Status:** ✅ READY FOR INTEGRATION

---

## 📦 WHAT YOU NEED

### 1. Login/Auth Endpoints

#### For Super Admin & Ward Admin (Email/Password)
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}

Response:
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
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

#### For Citizens (OTP-Based)
```
POST /api/auth/send-otp
{
  "phone": "+91 9876543210"
}

POST /api/auth/verify-otp
{
  "phone": "+91 9876543210",
  "otp": "123456"
}
```

---

## 👤 SAMPLE TEST CREDENTIALS

### Super Admin
```
Email:    super.admin@council.com
Password: SuperAdmin@123
Phone:    +91 8888888888
```

### Ward Admin 1
```
Email:    rajesh.sharma@wardadmin.com
Password: WardAdmin@123
Phone:    +91 9876543210
Ward:     15
```

### Ward Admin 2
```
Email:    priya.desai@wardadmin.com
Password: WardAdmin@456
Phone:    +91 9876543211
Ward:     12
```

### Citizen (OTP Login)
```
Phone: +91 9999999999
OTP:   Check console/SMS in dev
```

---

## 🔐 HOW IT WORKS

### For Super Admin & Ward Admin:
```
1. User enters email & password
   ↓
2. Frontend calls POST /api/auth/login
   ↓
3. Backend verifies credentials
   ↓
4. Backend returns JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in all API requests
   ↓
7. User logged in for 10 days or until logout
```

### For Citizens:
```
1. User enters phone number
   ↓
2. Frontend calls POST /api/auth/send-otp
   ↓
3. User receives OTP via SMS
   ↓
4. User enters OTP
   ↓
5. Frontend calls POST /api/auth/verify-otp
   ↓
6. Backend returns JWT token
   ↓
7. Same as admin flow from step 5 onwards
```

---

## 💾 FRONTEND INTEGRATION CODE

### Super Admin Login
```javascript
async function loginSuperAdmin(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('session_expiry', data.data.session_expiry);

      // Redirect to dashboard
      window.location.href = '/super-admin/dashboard';
    } else {
      // Show error
      alert(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Ward Admin Login
```javascript
async function loginWardAdmin(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('session_expiry', data.data.session_expiry);

      window.location.href = '/ward-admin/dashboard';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### API Request with Token
```javascript
async function getWardCitizens(wardId) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `/api/admin/users?role=citizen&ward=${wardId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json();
  return data.data;
}
```

### Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('session_expiry');
  window.location.href = '/login';
}
```

---

## 🔑 TOKEN MANAGEMENT

### Store After Login
```javascript
localStorage.setItem('token', response.data.data.token);
```

### Use in All Protected Requests
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

### Handle Token Expiry
```javascript
// Check if token is about to expire
const expiryTime = new Date(localStorage.getItem('session_expiry'));
const now = new Date();

if (now > expiryTime) {
  // Token expired, redirect to login
  logout();
}
```

---

## 🛡️ SECURITY NOTES

- ✅ Passwords stored securely with bcrypt hashing
- ✅ JWT tokens signed with secret key
- ✅ Tokens expire after 10 days
- ✅ Use HTTPS in production
- ✅ Store token securely (localStorage is vulnerable to XSS)
- ✅ Implement logout to clear tokens
- ✅ Validate token on every API request

---

## 🧪 TESTING WITH POSTMAN

### 1. Login Request
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers: Content-Type: application/json
Body: {
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}
```

### 2. Copy Token from Response

### 3. Test Protected Endpoint
```
Method: GET
URL: http://localhost:3000/api/admin/users?role=citizen
Headers: 
  - Authorization: Bearer <paste_token_here>
  - Content-Type: application/json
```

---

## 📚 AVAILABLE ENDPOINTS (After Login)

| Endpoint | Method | Super Admin | Ward Admin | Citizen |
|----------|--------|:-----------:|:----------:|:-------:|
| /api/admin/users | GET | ✅ | ✅ | ❌ |
| /api/admin/userdetails | GET | ✅ | ✅ | ✅ |
| /api/admin/complaints/my | GET | ✅ | ✅ | ✅ |
| /api/officers | GET | ✅ | ✅ | ✅ |
| /api/admin/announcement | POST | ✅ | ✅ | ❌ |
| /api/admin/categories/{id}/officers | GET | ✅ | ✅ | ❌ |

---

## 🎯 IMPLEMENTATION CHECKLIST

**Frontend Super Admin Developer:**
- [ ] Create login page with email/password fields
- [ ] Call `/api/auth/login` endpoint
- [ ] Store token in localStorage
- [ ] Redirect to super admin dashboard
- [ ] Include token in all API requests
- [ ] Test with: `super.admin@council.com` / `SuperAdmin@123`
- [ ] Implement logout

**Frontend Ward Admin Developer:**
- [ ] Create login page with email/password fields
- [ ] Call `/api/auth/login` endpoint
- [ ] Store token in localStorage
- [ ] Redirect to ward admin dashboard
- [ ] Include token in all API requests
- [ ] Test with: `rajesh.sharma@wardadmin.com` / `WardAdmin@123`
- [ ] Implement logout

---

## 📞 SUPPORT

### Documentation Files
1. **QUICK_REFERENCE_CARD.md** - Quick one-page reference
2. **AUTH_API_DOCUMENTATION.md** - Complete API documentation
3. **LOGIN_CREDENTIALS_FOR_TESTING.md** - Credentials and setup
4. **WARD_ADMIN_LOGIN_GUIDE.md** - Detailed login guide

### Server Status
```
URL: http://localhost:3000
Health Check: http://localhost:3000/health
API Root: http://localhost:3000/api
```

### Backend Status
✅ Server Running
✅ All endpoints implemented
✅ Authentication working
✅ Test credentials ready

---

## 🚀 NEXT STEPS

1. **Copy credentials** from this document
2. **Implement login UI** in your frontend
3. **Call `/api/auth/login`** endpoint
4. **Test with sample credentials** provided
5. **Store token** in localStorage
6. **Include token** in API requests
7. **Implement logout** to clear token

---

**Everything is ready!** Start integrating the login flow into your frontend applications.

For questions or issues, refer to the documentation files in the backend folder.

✅ **Status: READY FOR PRODUCTION**
