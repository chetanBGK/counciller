# Councillor App API Documentation

**Base URL**: `http://localhost:3000/api`  
**Version**: 1.0.0  
**Content-Type**: `application/json`

---

## Authentication Endpoints

### 1. Send OTP

**Endpoint**: `POST /auth/send-otp`

**Description**: Send OTP to user's phone number for login

**Request**:
```json
{
  "phone": "+919876543210"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}
```

---

### 2. Verify OTP & Login

**Endpoint**: `POST /auth/verify-otp`

**Description**: Verify OTP and receive JWT token

**Request**:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "phone": "+919876543210",
      "name": "John Doe",
      "role": "citizen",
      "created_at": "2024-12-06T10:00:00Z"
    }
  }
}
```

---

## User Endpoints

### 1. Get User Profile

**Endpoint**: `GET /user/me`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "phone": "+919876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "address_line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "role": "citizen"
  }
}
```

---

### 2. Update User Profile

**Endpoint**: `PUT /user/update`

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "language": "en"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.new@example.com"
  }
}
```

---

### 3. Update User Location

**Endpoint**: `PUT /user/location`

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "address_line1": "123 Main Street",
  "area": "Downtown",
  "landmark": "Near City Hall",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

---

### 4. Get User Notifications

**Endpoint**: `GET /user/notifications?limit=20&offset=0`

**Headers**: `Authorization: Bearer <token>`

---

## Complaint Endpoints

### 1. Create Complaint

**Endpoint**: `POST /complaints/create`

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic congestion",
  "category_id": 3,
  "ward_id": 5,
  "priority": "high",
  "severity": "medium",
  "address_line1": "123 Main Street",
  "area": "Downtown",
  "landmark": "Near Post Office",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Pothole on Main Street",
    "status": "submitted",
    "priority": "high",
    "created_at": "2024-12-06T10:00:00Z"
  }
}
```

---

### 2. Get My Complaints

**Endpoint**: `GET /complaints/my?limit=20&offset=0`

**Headers**: `Authorization: Bearer <token>`

---

### 3. Get Complaint Detail

**Endpoint**: `GET /complaints/:id`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Complaint details retrieved",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Pothole on Main Street",
    "description": "...",
    "status": "submitted",
    "priority": "high",
    "councillor_name": "Jane Smith",
    "attachments": [
      {
        "id": 1,
        "file_url": "https://...",
        "file_type": "image/jpeg"
      }
    ],
    "comment_threads": [
      {
        "id": 10,
        "complaint_id": 42,
        "user_id": 7,
        "user_name": "Officer A",
        "user_role": "officer",
        "comment": "Team assigned and inspection scheduled",
        "created_at": "2026-02-06T10:30:00Z"
      }
    ]
  }
}
```

---

### 4. Get Complaint Comments

**Endpoint**: `GET /complaints/:id/comments`

**Headers**: `Authorization: Bearer <token>`

**Access**: Reporter, assigned officer/operator, ward admin, super admin, councillor of same ward

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "complaint_id": 42,
      "user_id": 7,
      "user_name": "Officer A",
      "user_role": "officer",
      "comment": "Team assigned and inspection scheduled",
      "created_at": "2026-02-06T10:30:00Z"
    }
  ]
}
```

---

### 5. Add Complaint Comment

**Endpoint**: `POST /complaints/:id/comments`

**Headers**: `Authorization: Bearer <token>`

**Access**: Reporter, assigned officer/operator, ward admin, super admin, councillor of same ward

**Request**:
```json
{
  "comment": "Inspection completed; repair scheduled for tomorrow."
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 11,
    "complaint_id": 42,
    "user_id": 7,
    "comment": "Inspection completed; repair scheduled for tomorrow.",
    "created_at": "2026-02-06T11:05:00Z"
  }
}
```

---

### 6. Get Complaint Rating

**Endpoint**: `GET /complaints/:id/rating`

**Headers**: `Authorization: Bearer <token>`

**Access**: Reporter, assigned officer/operator, ward admin, super admin, councillor of same ward

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "complaint_id": 42,
    "user_id": 1,
    "rating": 4,
    "comment": "Issue resolved quickly",
    "created_at": "2026-02-06T12:10:00Z"
  }
}
```

---

### 7. Add Complaint Rating

**Endpoint**: `POST /complaints/:id/rating`

**Headers**: `Authorization: Bearer <token>`

**Access**: Reporter only

**Rules**: Allowed only when complaint status is `resolved`, `closed`, or `citizen_confirmed`

**Request**:
```json
{
  "rating": 5,
  "comment": "Great response, thanks!"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 6,
    "complaint_id": 42,
    "user_id": 1,
    "rating": 5,
    "comment": "Great response, thanks!",
    "created_at": "2026-02-06T12:15:00Z"
  }
}
```

---

### 8. Confirm Complaint

**Endpoint**: `PUT /complaints/confirm/:id`

**Headers**: `Authorization: Bearer <token>`

---

## Councillor Endpoints

### 1. Get Dashboard

**Endpoint**: `GET /councillor/dashboard`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

**Response**:
```json
{
  "success": true,
  "message": "Dashboard retrieved",
  "data": {
    "stats": {
      "total_new": 15,
      "total_in_progress": 8,
      "total_closed": 42,
      "total_complaints": 65
    },
    "metrics": {
      "avg_resolution_days": 3.5,
      "high_priority_count": 10,
      "medium_priority_count": 25,
      "low_priority_count": 30
    }
  }
}
```

---

### 2. Get Councillor Complaints

**Endpoint**: `GET /councillor/complaints?status=submitted&limit=20&offset=0`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

---

### 3. Approve Complaint

**Endpoint**: `PUT /councillor/approve/:id`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

---

### 4. Mark In Progress

**Endpoint**: `PUT /councillor/in-progress/:id`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

---

### 5. Complete Complaint

**Endpoint**: `PUT /councillor/complete/:id`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

**Request**:
```json
{
  "resolution_notes": "Pothole has been filled and road is now safe"
}
```

---

### 6. Add Note to Complaint

**Endpoint**: `POST /councillor/note/:id`

**Headers**: `Authorization: Bearer <token>` (Role: councillor/councillor_admin)

**Request**:
```json
{
  "note": "Assigned to contractor ABC Ltd for repair"
}
```

---

## Admin Endpoints

### 1. Create Announcement

**Endpoint**: `POST /admin/announcement`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

**Request**:
```json
{
  "title": "Scheduled Maintenance",
  "description": "Water supply will be shut down on December 10",
  "image_url": "https://...",
  "target_role": "citizen"
}
```

---

### 2. Create Category

**Endpoint**: `POST /admin/category`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

**Request**:
```json
{
  "name": "Road Damage"
}
```

---

### 3. Create Ward

**Endpoint**: `POST /admin/ward`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

**Request**:
```json
{
  "name": "Ward 5",
  "number": 5,
  "sub_ward_code": "A",
  "population": 45000,
  "area_sq_km": 2.5,
  "office_address": "123 Government Plaza",
  "contact_number": "+919876543210"
}
```

---

### 4. Create Employee (Councillor/Admin)

**Endpoint**: `POST /admin/create-admin-employee`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

**Request**:
```json
{
  "phone": "+919876543211",
  "name": "Jane Smith",
  "ward_id": 5,
  "role": "councillor"
}
```

---

### 5. Get Employees

**Endpoint**: `GET /admin/employees?role=councillor`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

---

### 6. Dashboard Stats

**Endpoint**: `GET /admin/dashboard-stats`

**Headers**: `Authorization: Bearer <token>` (Role: councillor_admin)

**Response**:
```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "totalComplaints": 350,
    "totalUsers": 1200,
    "totalCouncillors": 8,
    "complaintsByStatus": [
      { "status": "submitted", "count": 45 },
      { "status": "approved", "count": 30 },
      { "status": "in_progress", "count": 25 },
      { "status": "closed", "count": 250 }
    ]
  }
}
```

---

## Reports & Downloads (Ward Admin)

### 1. Get Reports Summary

**Endpoint**: `GET /reports/complaints`

**Headers**: `Authorization: Bearer <token>` (Role: ward_admin)

**Query Params**:
- `from_date` (YYYY-MM-DD)
- `to_date` (YYYY-MM-DD)
- `complaint_type` (`ai` | `manual` | `all`)
- `category_id`
- `status`
- `location` (text search)
- `repeated_only` (`true` | `false`)

**Response**:
```json
{
  "success": true,
  "message": "Reports retrieved",
  "data": {
    "summary": {
      "total_complaints": 124,
      "ai_complaints": 56,
      "manual_complaints": 68,
      "repeated_location_complaints": 14,
      "most_reported_category": "Garbage"
    },
    "charts": {
      "complaint_type_split": [
        { "label": "AI Complaints", "value": 56 },
        { "label": "Manual Complaints", "value": 68 }
      ],
      "category_wise": [
        { "label": "Garbage", "value": 40 },
        { "label": "Road", "value": 18 }
      ],
      "repeated_locations": [
        { "label": "Ward A", "value": 8 },
        { "label": "Ward B", "value": 5 }
      ]
    }
  }
}
```

---

### 2. Download Reports (Excel/PDF)

**Endpoint**: `GET /reports/complaints/export?format=excel|pdf`

**Headers**: `Authorization: Bearer <token>` (Role: ward_admin)

**Query Params**: Same as summary endpoint

**Response**: File download (`ward_reports.csv` or `ward_reports.pdf`)

---

## AI Endpoints

### 1. Process Complaint

**Endpoint**: `POST /ai/process`

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "title": "Water leaking from municipal pipe",
  "description": "Large water loss near market area",
  "images": []
}
```

**Response**:
```json
{
  "success": true,
  "message": "Complaint processed by AI",
  "data": {
    "summary": "Water pipe leak in market area causing resource wastage",
    "category": "water",
    "priority": "high",
    "address": {
      "address_line1": "Market Street",
      "area": "Market",
      "landmark": "Near Town Hall",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }
}
```

---

## Notification Endpoints

### 1. Get Notifications

**Endpoint**: `GET /notifications?limit=20&offset=0`

**Headers**: `Authorization: Bearer <token>`

---

### 2. Mark as Read

**Endpoint**: `PUT /notifications/read/:id`

**Headers**: `Authorization: Bearer <token>`

---

### 3. Mark All as Read

**Endpoint**: `PUT /notifications/read-all`

**Headers**: `Authorization: Bearer <token>`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Common HTTP Status Codes

- **200**: OK
- **201**: Created
- **400**: Bad Request (missing/invalid fields)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## Rate Limiting

No rate limiting is currently implemented. Consider adding:
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per user for authenticated endpoints

---

## Pagination

All list endpoints support pagination:

```
?limit=20&offset=0
```

- **limit**: Number of records (default: 20)
- **offset**: Number of records to skip (default: 0)

---

## Testing with cURL

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Get Profile (with token)
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer <token>"
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-06 | Initial release |

---

**Last Updated**: December 6, 2024