# 📋 COMPLETE API ENDPOINTS REFERENCE

**Base URL:** `http://localhost:3000/api`

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Send OTP (Citizens)
```
POST /auth/send-otp

Request Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+91 9876543210"
}

Response (200):
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}

Status Codes:
- 200: Success
- 400: Missing phone number
```

---

### 2. Verify OTP (Citizens)
```
POST /auth/verify-otp

Request Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+91 9876543210",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "+91 9876543210",
      "email": null,
      "name": "Amit Kumar",
      "role": "citizen",
      "ward_id": 8
    },
    "session_expiry": "2026-01-23T10:30:00Z"
  }
}

Status Codes:
- 200: Success
- 400: Invalid or expired OTP
```

---

### 3. Email/Password Login (Super Admin & Ward Admin)
```
POST /auth/login

Request Headers:
- Content-Type: application/json

Request Body:
{
  "email": "rajesh.sharma@wardadmin.com",
  "password": "WardAdmin@123"
}

Response (200):
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

Status Codes:
- 200: Success
- 400: Invalid email or password
```

---

## 👥 CITIZEN ENDPOINTS

### 4. Get Citizens List (Ward Admin / Super Admin)
```
GET /admin/users?role=citizen&limit=20&offset=0

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Query Parameters:
- role: "citizen" (optional, defaults to citizen)
- limit: number (default: 20)
- offset: number (default: 0)

Response (200):
{
  "success": true,
  "message": "Citizens fetched successfully",
  "data": [
    {
      "citizen_id": 1,
      "name": "Rajesh Sharma",
      "phone_number": "+91 9876543210",
      "email": "rajesh@gmail.com",
      "ward": "Ward 15",
      "voter_id": "TN/12/456789"
    }
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized
```

---

### 5. Get Citizen Details (Ward Admin / Super Admin)
```
GET /admin/userdetails?id=<userid>

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Query Parameters:
- id: number (required)

Response (200):
{
  "success": true,
  "message": "Citizen details fetched successfully",
  "data": {
    "citizen_id": 1,
    "name": "Rajesh Sharma",
    "phone_number": "+91 9876543210",
    "email": "rajesh@gmail.com",
    "ward": "Ward 15",
    "voter_id": "TN/12/456789",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "blood_group": "O+ve",
    "disability": "None",
    "language": "English",
    "aadhar_number": "7539 4665 4574"
  }
}

Status Codes:
- 200: Success
- 400: User ID required
- 401: Unauthorized
- 404: Citizen not found
```

---

## 🎯 COMPLAINT ENDPOINTS

### 6. Get Complaints (Ward Admin / Super Admin)
```
GET /admin/complaints/my?councillorId=<id>&limit=20&offset=0

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Query Parameters:
- councillorId: number (required)
- status: string (optional - SUBMITTED, IN_PROGRESS, RESOLVED)
- category: number (optional)
- ward: number (optional)
- limit: number (default: 20)
- offset: number (default: 0)

Response (200):
{
  "success": true,
  "message": "Complaints fetched successfully",
  "data": [
    {
      "complaint_id": "CMP234567",
      "category": "Street Lights",
      "summary": "Broken street light on MG Road",
      "status": "IN_PROGRESS",
      "ward": "Ward 15",
      "date_time": "2024-12-05T13:16:00Z"
    }
  ]
}

Status Codes:
- 200: Success
- 400: Councillor ID required
- 401: Unauthorized
```

---

## 👮 OFFICER ENDPOINTS

### 7. Get Officers List (All)
```
GET /officers

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Response (200):
{
  "success": true,
  "message": "Officers fetched successfully",
  "data": [
    {
      "officer_id": 1,
      "name": "Rajesh Sharma",
      "designation": "Senior Officer",
      "department": "Ward 15",
      "phone_number": "+91 9876543210"
    }
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized
```

---

### 8. Get Officers by Category (Ward Admin / Super Admin)
```
GET /admin/categories/<categoryId>/officers

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Path Parameters:
- categoryId: number (required)

Response (200):
{
  "success": true,
  "message": "Officers fetched successfully",
  "data": {
    "categoryId": 1,
    "officers": [
      {
        "officer_id": 1,
        "officer_name": "Rajesh Sharma",
        "phone_number": "+91 9876543210"
      }
    ]
  }
}

Status Codes:
- 200: Success
- 400: Category ID required
- 401: Unauthorized
```

---

## 📢 EVENT/ANNOUNCEMENT ENDPOINTS

### 9. Create Announcement (Ward Admin / Super Admin)
```
POST /admin/announcement

Request Headers:
- Authorization: Bearer <token>
- Content-Type: multipart/form-data

Form Data:
- event_name: string (required)
- category_id: number (required)
- description: string (required)
- photos[]: file array (required, min 1, max 5 images)
  - Accepted: JPEG, PNG, WebP, JPG
- videos[]: file array (optional, max 5 videos)
  - Accepted: MP4, MPEG, MOV, AVI

Response (201):
{
  "success": true,
  "message": "Event created successfully"
}

Status Codes:
- 201: Created
- 400: Validation failed (missing fields, too many files, etc.)
- 401: Unauthorized
```

---

### 10. Get Announcements (All)
```
GET /announcements?limit=20&offset=0

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Query Parameters:
- limit: number (default: 20)
- offset: number (default: 0)
- target_role: string (optional)

Response (200):
{
  "success": true,
  "message": "Announcements retrieved",
  "data": [
    {
      "id": 1,
      "title": "Community Drive",
      "description": "Cleanup drive",
      "created_at": "2024-12-20T10:30:00Z"
    }
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized
```

---

## 🏛️ CATEGORY ENDPOINTS

### 11. Create Category (Super Admin / Ward Admin)
```
POST /admin/category

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Request Body:
{
  "name": "Street Lights"
}

Response (201):
{
  "success": true,
  "message": "Category created",
  "data": {
    "id": 5,
    "name": "Street Lights",
    "created_at": "2024-12-20T10:30:00Z"
  }
}

Status Codes:
- 201: Created
- 400: Category name required
- 401: Unauthorized
```

---

### 12. Get Categories (All)
```
GET /admin/category

Request Headers:
- Authorization: Bearer <token>
- Content-Type: application/json

Response (200):
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "category_id": 1,
      "category_name": "Street Lights",
      "phone_number": null,
      "total_complaints": 25
    }
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized
```

---

## 🏥 HEALTH & STATUS

### 13. Health Check (No Auth)
```
GET /health

Response (200):
{
  "status": "OK",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

---

### 14. API Root (No Auth)
```
GET /

Redirects to: /api

GET /api

Response (200):
{
  "message": "Councillor App Backend API",
  "docs": "/API_DOCUMENTATION.md",
  "health": "/health"
}
```

---

## 🔐 AUTHENTICATION FLOW

### For Super Admin & Ward Admin:
```
1. POST /api/auth/login
   ├─ Request: email, password
   └─ Response: token, user, session_expiry

2. Store token in localStorage

3. Use token in all requests:
   Authorization: Bearer <token>
```

### For Citizens:
```
1. POST /api/auth/send-otp
   ├─ Request: phone
   └─ Response: otp (for dev only)

2. POST /api/auth/verify-otp
   ├─ Request: phone, otp
   └─ Response: token, user, session_expiry

3. Use token in all requests:
   Authorization: Bearer <token>
```

---

## 📊 RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {
    // Actual response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔑 AVAILABLE ROLES

| Role | Access Level |
|------|---|
| `super_admin` | All operations |
| `councillor_admin` | Ward-level operations |
| `councillor` | Read-only operations |
| `citizen` | Self-only operations |

---

## ⏰ TOKEN DETAILS

- **Validity:** 10 days
- **Type:** JWT (Bearer Token)
- **Algorithm:** HS256
- **Format:** `Authorization: Bearer <token>`

---

## 🎯 SUMMARY

**Total Endpoints:** 14
**Authentication Methods:** 3 (OTP, Email/Password, JWT)
**Roles:** 4 (Super Admin, Ward Admin, Councillor, Citizen)

✅ All endpoints documented
✅ Sample test credentials provided
✅ Error handling implemented
✅ Ready for frontend integration

**For detailed documentation, see other docs in backend folder.**
