# Ward Admin Login Documentation

## Overview

The backend uses **OTP-based authentication** (One-Time Password) for secure login. This eliminates the need for password management and provides a secure, SMS-based authentication flow.

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WARD ADMIN LOGIN FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 1. Ward Admin enters phone number                               │
│    ↓                                                             │
│ 2. Frontend calls POST /api/auth/send-otp                       │
│    ↓                                                             │
│ 3. Backend generates 6-digit OTP                                │
│    ↓                                                             │
│ 4. OTP stored in database (valid for 10 minutes)                │
│    ↓                                                             │
│ 5. OTP sent to ward admin's phone (SMS integration)             │
│    ↓                                                             │
│ 6. Ward admin receives OTP and enters it                        │
│    ↓                                                             │
│ 7. Frontend calls POST /api/auth/verify-otp                     │
│    ↓                                                             │
│ 8. Backend verifies OTP against database                        │
│    ↓                                                             │
│ 9. JWT token generated and returned                             │
│    ↓                                                             │
│ 10. Ward admin logged in, uses token for API calls              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### 1️⃣ SEND OTP - Request OTP via SMS

**Endpoint**: `POST /api/auth/send-otp`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "+91 9876543210"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Phone number is required"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9876543210"
  }'
```

---

### 2️⃣ VERIFY OTP - Complete Login

**Endpoint**: `POST /api/auth/verify-otp`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "+91 9876543210",
  "otp": "123456"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "phone": "+91 9876543210",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15,
      "created_at": "2024-12-15T10:30:00Z"
    },
    "session_expiry": "2025-01-10T14:22:45.123Z"
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 9876543210",
    "otp": "123456"
  }'
```

---

## Authentication Features

### OTP Details
- **Length**: 6 digits
- **Validity**: 10 minutes from generation
- **Auto-delete**: OTP is deleted after successful verification
- **Security**: Can only be verified once

### JWT Token
- **Expiry**: 10 days (configurable via JWT_EXPIRY env variable)
- **Payload Contains**:
  - User ID
  - Phone number
  - User role (councillor_admin, citizen, etc.)
  - User name
- **Token Format**: Bearer token in Authorization header

### Session Management
- **Session Expiry**: 10 days
- **Auto-create User**: If phone number doesn't exist, user is automatically created with `citizen` role
- **Role Assignment**: User role is determined by database record (must be set separately for ward admin access)
- **Last Login**: Tracked with IP address

---

## Frontend Integration Steps

### Step 1: Send OTP Screen
```javascript
// User enters phone number and clicks "Send OTP"
async function sendOTP(phone) {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  
  const data = await response.json();
  if (data.success) {
    // Show OTP input screen
    showOTPVerificationScreen();
  } else {
    // Show error
    showError(data.message);
  }
}
```

### Step 2: Verify OTP Screen
```javascript
// User receives OTP and enters it
async function verifyOTP(phone, otp) {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  
  const data = await response.json();
  if (data.success) {
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    localStorage.setItem('session_expiry', data.data.session_expiry);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    // Show error (Invalid OTP or expired)
    showError(data.message);
  }
}
```

### Step 3: Use Token in API Calls
```javascript
// All subsequent API calls include the token
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
  return data;
}
```

---

## User Roles & Access Control

### Role Hierarchy
```
Super Admin (super_admin)
  ├── Can manage all data
  └── Can assign roles

Ward Admin (councillor_admin)
  ├── Manage complaints in assigned ward
  ├── Manage citizens in ward
  ├── Create events/announcements
  └── View officers

Councillor (councillor)
  ├── View complaints
  └── Update complaint status

Citizen (citizen)
  ├── File complaints
  └── View own complaints
```

### Assigning Ward Admin Role

Ward Admin users must have their role set to `councillor_admin` in the database:

```sql
UPDATE users 
SET role = 'councillor_admin', ward_id = 15 
WHERE phone = '+91 9876543210';
```

---

## Security Considerations

### ✅ Security Features
- OTP expires after 10 minutes
- OTP is deleted after verification
- JWT token expires after 10 days
- Passwords not stored (OTP-based)
- Token required for all protected endpoints
- Role-based access control enforced

### ⚠️ Important Notes
- **SMS Integration**: Currently logs OTP to console (check development logs)
- **Production SMS**: Integrate with SMS provider (AWS SNS, Twilio, etc.)
- **JWT Secret**: Must be set in environment variable `JWT_SECRET`
- **HTTPS**: Use HTTPS in production only
- **Token Storage**: Store securely (avoid XSS attacks)

---

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=10d

# SMS Configuration (when integrated)
SMS_PROVIDER=twilio  # or aws-sns
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+1234567890

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/councillor_db
```

---

## Database Schema

### otp_requests Table
```sql
CREATE TABLE otp_requests (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(phone)
);
```

### users Table (relevant fields)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen',
  name VARCHAR(255),
  ward_id INTEGER REFERENCES wards(id),
  session_expiry TIMESTAMP,
  last_login TIMESTAMP,
  last_login_ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Example Login Flow

### Scenario: Ward Admin Login

**Step 1: User enters phone number**
```
User: +91 9876543210
```

**Step 2: Frontend sends request**
```bash
POST /api/auth/send-otp
{
  "phone": "+91 9876543210"
}
```

**Step 3: Backend response**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "456789"
  }
}
```

**Step 4: User receives SMS with OTP: "456789"**

**Step 5: User enters OTP**
```
OTP: 456789
```

**Step 6: Frontend sends verification request**
```bash
POST /api/auth/verify-otp
{
  "phone": "+91 9876543210",
  "otp": "456789"
}
```

**Step 7: Backend verifies and returns token**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrOTEgOTg3NjU0MzIxMCIsInJvbGUiOiJjb3VuY2lsbG9yX2FkbWluIn0...",
    "user": {
      "id": 5,
      "phone": "+91 9876543210",
      "name": "Rajesh Sharma",
      "role": "councillor_admin",
      "ward_id": 15
    },
    "session_expiry": "2025-01-10T14:22:45.123Z"
  }
}
```

**Step 8: Frontend stores token**
```javascript
localStorage.setItem('token', data.data.token);
localStorage.setItem('user', JSON.stringify(data.data.user));
```

**Step 9: User can now access protected endpoints**
```bash
GET /api/admin/users?role=citizen
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Troubleshooting

### Issue: "Phone number is required"
- **Cause**: Phone field not sent in request body
- **Fix**: Ensure phone is included in POST request

### Issue: "Invalid or expired OTP"
- **Cause**: Wrong OTP or more than 10 minutes passed
- **Fix**: Request new OTP using send-otp endpoint

### Issue: "401 Unauthorized" on protected endpoints
- **Cause**: Token not sent or expired
- **Fix**: Ensure token is in `Authorization: Bearer <token>` header

### Issue: User auto-created with 'citizen' role
- **Cause**: New phone number in system
- **Fix**: Manually update user role in database to 'councillor_admin'

---

## API Testing with Postman

### Setup Collection
1. Create new collection: "Ward Admin Auth"
2. Add environment variables:
   ```
   {{base_url}} = http://localhost:3000/api
   {{phone}} = +91 9876543210
   {{otp}} = (will update after send-otp)
   {{token}} = (will update after verify-otp)
   ```

### Request 1: Send OTP
```
Method: POST
URL: {{base_url}}/auth/send-otp
Headers: Content-Type: application/json
Body: {
  "phone": "{{phone}}"
}
```

### Request 2: Verify OTP
```
Method: POST
URL: {{base_url}}/auth/verify-otp
Headers: Content-Type: application/json
Body: {
  "phone": "{{phone}}",
  "otp": "{{otp}}"
}
```
*Extract token from response and save to environment variable*

### Request 3: Test Protected Endpoint
```
Method: GET
URL: {{base_url}}/admin/users?role=citizen
Headers: Authorization: Bearer {{token}}
```

---

## Summary

Ward admin login uses a **secure OTP-based authentication** system:

1. **Send OTP**: `/api/auth/send-otp` - Request OTP via phone
2. **Verify OTP**: `/api/auth/verify-otp` - Enter OTP and get JWT token
3. **Use Token**: Include token in `Authorization` header for all API calls

The system automatically creates users and issues JWT tokens valid for 10 days. Make sure to set the user role to `councillor_admin` in the database for ward admin access control to work properly.

---

**Last Updated**: December 31, 2024
