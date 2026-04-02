# Quick Login Reference

## 🔐 Ward Admin Login - Two Step Process

### Step 1: Send OTP
```
POST /api/auth/send-otp

Request:
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

### Step 2: Verify OTP & Login
```
POST /api/auth/verify-otp

Request:
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
      "id": 5,
      "phone": "+91 9876543210",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15
    },
    "session_expiry": "2025-01-10T14:22:45Z"
  }
}
```

---

## 🔑 Using the Token

### Store Token
```javascript
const token = response.data.data.token;
localStorage.setItem('token', token);
```

### Send Token in Requests
```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Example API Call
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/admin/users?role=citizen
```

---

## ⏱️ Important Details

| Item | Details |
|------|---------|
| OTP Length | 6 digits |
| OTP Validity | 10 minutes |
| Token Validity | 10 days |
| Auto-create User | Yes (if first time) |
| Default Role | citizen (change to councillor_admin in DB) |

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| "Phone number is required" | Include phone in request body |
| "Invalid or expired OTP" | Request new OTP (send-otp again) |
| "401 Unauthorized" | Include token in Authorization header |
| Cannot access ward admin features | Update user role to `councillor_admin` in database |

---

## 📱 Frontend Flow

```
1. User enters phone number
   ↓
2. Call POST /auth/send-otp
   ↓
3. User receives OTP via SMS
   ↓
4. User enters OTP
   ↓
5. Call POST /auth/verify-otp
   ↓
6. Store token in localStorage
   ↓
7. Redirect to dashboard
   ↓
8. Include token in all API calls
```

---

## 💡 Setup Checklist

- [ ] Users table has `role` and `ward_id` columns
- [ ] Update ward admin user role to `councillor_admin` in database
- [ ] Set `JWT_SECRET` environment variable
- [ ] SMS integration configured (or check console logs in dev)
- [ ] Frontend stores token in localStorage
- [ ] Frontend sends token in Authorization header for all API calls
- [ ] Handle token expiry and logout

---

**Need more details?** See `WARD_ADMIN_LOGIN_GUIDE.md`
