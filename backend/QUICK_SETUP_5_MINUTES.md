# 🚀 QUICK SETUP - Test Credentials in 5 Minutes

---

## ⚡ 5-Minute Setup

### 1️⃣ Start Backend (30 seconds)
```bash
cd c:\Spw Project\backend
npm start
```

**Expected Output:**
```
✅ Server running on http://localhost:3000
✅ Health: /health
```

---

### 2️⃣ Setup Database (2 minutes)

**Open PostgreSQL Client** (DBeaver, pgAdmin, psql, etc.)

**Copy & Paste these SQL commands:**

```sql
-- ========== SETUP TEST USERS ==========

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

-- Ward Admin 1 (Rajesh Sharma)
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

-- Ward Admin 2 (Priya Kumar)
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

-- Sample Citizen
INSERT INTO users (phone, name, role, ward_id, created_at)
VALUES (
  '+91 9999999999',
  'Amit Kumar',
  'citizen',
  8,
  NOW()
);
```

**Hit:** ▶️ Execute (or Ctrl+Enter)

**Expected:** 4 rows inserted ✅

---

### 3️⃣ Verify Setup (1 minute)

**Run this query to confirm:**
```sql
SELECT id, email, name, role, ward_id FROM users 
WHERE email IN (
  'super_admin@councilapp.com',
  'rajesh.sharma@wardadmin.com',
  'priya.kumar@wardadmin.com'
)
ORDER BY id;
```

**Expected Output:**
```
id | email                          | name           | role             | ward_id
---|--------------------------------|----------------|------------------|--------
1  | super_admin@councilapp.com    | Super Admin    | super_admin      | (null)
5  | rajesh.sharma@wardadmin.com   | Rajesh Sharma  | councillor_admin | 15
6  | priya.kumar@wardadmin.com     | Priya Kumar    | councillor_admin | 8
```

✅ All 3 users exist!

---

### 4️⃣ Test Login (1.5 minutes)

**Option A: Using Postman**

1. Open Postman
2. Create new request:
   ```
   POST http://localhost:3000/api/auth/login
   ```
3. Headers:
   ```
   Content-Type: application/json
   ```
4. Body (raw JSON):
   ```json
   {
     "email": "rajesh.sharma@wardadmin.com",
     "password": "WardAdmin@123"
   }
   ```
5. Click **Send**

**Option B: Using Browser Console**

```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'rajesh.sharma@wardadmin.com',
    password: 'WardAdmin@123'
  })
})
.then(r => r.json())
.then(d => console.log(d));
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
      "email": "rajesh.sharma@wardadmin.com",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}
```

✅ **You got a token!**

---

### 5️⃣ Use Token (30 seconds)

**Copy the token** from response

**In Postman, create new request:**
```
GET http://localhost:3000/api/admin/users?role=citizen
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Click Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Citizens fetched successfully",
  "data": [
    {
      "citizen_id": 7,
      "name": "Amit Kumar",
      "phone_number": "+91 9999999999",
      "email": null,
      "ward": "Ward 8",
      "voter_id": null
    }
  ]
}
```

✅ **API works with token!**

---

## 📋 Test Credentials Reference

```
┌─────────────────────────────────────────────────────────────┐
│ SUPER ADMIN                                                 │
├─────────────────────────────────────────────────────────────┤
│ Email:    super_admin@councilapp.com                       │
│ Password: SuperAdmin@123                                    │
│ Role:     super_admin (all permissions)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WARD ADMIN 1                                                │
├─────────────────────────────────────────────────────────────┤
│ Email:    rajesh.sharma@wardadmin.com                      │
│ Password: WardAdmin@123                                     │
│ Ward:     Ward 15                                           │
│ Role:     councillor_admin (ward-level permissions)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WARD ADMIN 2                                                │
├─────────────────────────────────────────────────────────────┤
│ Email:    priya.kumar@wardadmin.com                        │
│ Password: WardAdmin@456                                     │
│ Ward:     Ward 8                                            │
│ Role:     councillor_admin (ward-level permissions)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CITIZEN (OTP Login)                                         │
├─────────────────────────────────────────────────────────────┤
│ Phone:    +91 9999999999                                   │
│ Name:     Amit Kumar                                        │
│ Ward:     Ward 8                                            │
│ Role:     citizen (self-only access)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 All Test Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | ❌ | Login with email/password |
| `/api/auth/send-otp` | POST | ❌ | Send OTP to citizen phone |
| `/api/auth/verify-otp` | POST | ❌ | Verify OTP and get token |
| `/api/admin/users?role=citizen` | GET | ✅ | Get all citizens |
| `/api/admin/userdetails?id=7` | GET | ✅ | Get citizen details |
| `/api/officers` | GET | ✅ | Get all officers |
| `/api/admin/complaints/my?councillorId=5` | GET | ✅ | Get complaints |
| `/api/announcements` | GET | ✅ | Get announcements |

---

## 🧪 Test Scenarios

### Scenario 1: Ward Admin Login & View Citizens
```
1. Login as Ward Admin: rajesh.sharma@wardadmin.com / WardAdmin@123
2. Get token
3. Request GET /api/admin/users?role=citizen with token
4. Should see citizens in Ward 15
```

### Scenario 2: Super Admin Login & View All
```
1. Login as Super Admin: super_admin@councilapp.com / SuperAdmin@123
2. Get token
3. Request GET /api/admin/users?role=citizen with token
4. Should see all citizens from all wards
```

### Scenario 3: Citizen OTP Login
```
1. Send OTP: POST /api/auth/send-otp with +91 9999999999
2. Note OTP from console log
3. Verify OTP: POST /api/auth/verify-otp with phone + OTP
4. Get token
5. Can access only personal data
```

---

## ✅ Success Checklist

After 5-minute setup:

- [ ] Backend running on port 3000
- [ ] Database users created (4 INSERT commands executed)
- [ ] Login returns JWT token
- [ ] Token works in Authorization header
- [ ] API endpoints return data
- [ ] Role-based access works (Super Admin sees all, Ward Admin sees only their ward)

---

## 🆘 Troubleshooting

### ❌ "Invalid email or password"
**Solution:** Run the SQL INSERT commands again. Check PostgreSQL database has users.

### ❌ "User not found"
**Solution:** Make sure email spelling is exactly: `rajesh.sharma@wardadmin.com`

### ❌ "Unauthorized" on API calls
**Solution:** Add header: `Authorization: Bearer <your_token>`

### ❌ Backend not starting
**Solution:** 
```bash
npm install
npm start
```

### ❌ "Cannot connect to database"
**Solution:** Verify PostgreSQL is running and .env has correct DATABASE_URL

---

## 📚 More Information

For more details, see:
- `HOW_CREDENTIALS_WORK.md` - Technical explanation
- `COMPLETE_ENDPOINTS_REFERENCE.md` - All API endpoints
- `SAMPLE_TEST_CREDENTIALS.md` - All credentials
- `AUTH_API_DOCUMENTATION.md` - Full auth documentation

---

**Time:** 5 minutes ⏱️  
**Difficulty:** Easy 😊  
**Status:** ✅ Ready to go!
