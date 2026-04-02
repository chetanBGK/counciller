# Ward Admin & Super Admin API - Complete Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-12-29  
**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Categories](#categories)
4. [Citizens](#citizens)
5. [Complaints](#complaints)
6. [Officers](#officers)
7. [Councillors (Super Admin)](#councillors-super-admin)
8. [Councillor Actions](#councillor-actions)
9. [AI Features](#ai-features)
10. [Response Format](#response-format)
11. [Error Handling](#error-handling)

---

## Authentication

### Send OTP

**Endpoint:** `POST /auth/send-otp`

**Description:** Sends a one-time password to the provided phone number.

**Request Body:**
```json
{
  "phone": "+91 9876543210"
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | Yes | Phone number in E.164 format |

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+91 9876543210",
    "expires_in": 300
  }
}
```

---

### Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Description:** Verifies the OTP and returns JWT token for authentication.

**Request Body:**
```json
{
  "phone": "+91 9876543210",
  "otp": "123456"
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | Yes | Phone number (must match send-otp) |
| otp | string | Yes | 6-digit OTP received |

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user_id": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "councillor_admin",
    "name": "Admin User"
  }
}
```

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| user_id | integer | User ID in system |
| token | string | JWT token for API requests |
| role | string | User role: `citizen`, `councillor`, `councillor_admin`, `operator` |
| name | string | User's full name |

**Usage in Requests:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Dashboard

### Get Dashboard Stats

**Endpoint:** `GET /admin/dashboard-stats`

**Authentication:** Required (Bearer Token)

**Description:** Returns dashboard metrics including complaint statistics and recent complaints.

**Role-based Response:**
- `super_admin`: receives `dashboard_type: "super_admin"` and `required_fields` with:
  - `total_councillors`
  - `total_ward_admins`
  - `total_officers`
  - `total_citizens`
  - `total_complaints`
  - `resolved_complaints`
  - `total_category` (alias) / `total_categories`
- `ward_admin`, `councillor`, `officer`, `operator`: receives `dashboard_type: "ward"` with ward-scoped dashboard data.

**Query Parameters:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "total_complaints": 1247,
    "total_categories": 12,
    "pending_review": 38,
    "recent_complaints": [
      {
        "complaint_id": "CMP234567",
        "category": "Street Lights",
        "status": "IN_PROGRESS",
        "time": "5 min ago"
      },
      {
        "complaint_id": "CMP234568",
        "category": "Garbage Collection",
        "status": "COMPLETED",
        "time": "12 min ago"
      }
    ]
  }
}
```

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| total_complaints | integer | Total complaints in system |
| total_categories | integer | Total complaint categories |
| pending_review | integer | Complaints pending review |
| recent_complaints | array | Last 4 recent complaints |
| complaint_id | string | Unique complaint identifier |
| category | string | Category name |
| status | string | Current status |
| time | string | Time elapsed since creation |

---

## Categories

### List Categories

**Endpoint:** `GET /admin/category`

**Authentication:** Required

**Description:** Returns all complaint categories with complaint counts.

**Query Parameters:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "category_id": 1,
      "category_name": "Street Lights",
      "total_complaints": 156,
      "phone_number": "9588343566"
    },
    {
      "category_id": 2,
      "category_name": "Roads & Potholes",
      "total_complaints": 234,
      "phone_number": "9588343566"
    }
  ]
}
```

---

### Create Category

**Endpoint:** `POST /admin/category`

**Authentication:** Required (councillor_admin role)

**Request Body:**
```json
{
  "category_name": "Street Cleaning",
  "phone_number": "9588343566"
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category_name | string | Yes | Category name (unique) |
| phone_number | string | No | Contact phone number |

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 5,
    "name": "Street Cleaning",
    "phone_number": "9588343566",
    "created_at": "2025-12-29T10:00:00Z"
  }
}
```

---

### Update Category

**Endpoint:** `PUT /admin/category/{id}`

**Authentication:** Required (councillor_admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Category ID |

**Request Body:**
```json
{
  "category_name": "Street Cleaning Updated",
  "phone_number": "9588343567"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 5,
    "name": "Street Cleaning Updated",
    "phone_number": "9588343567",
    "updated_at": "2025-12-29T11:00:00Z"
  }
}
```

---

### Delete Category

**Endpoint:** `DELETE /admin/category/{id}`

**Authentication:** Required (councillor_admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Category ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Citizens

### List Citizens

**Endpoint:** `GET /admin/users`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| role | string | citizen | Filter by role (always citizen) |
| limit | integer | 20 | Results per page |
| offset | integer | 0 | Pagination offset |

**Example:**
```
GET /admin/users?role=citizen&limit=20&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "message": "Citizens fetched successfully",
  "data": [
    {
      "citizen_id": 1,
      "name": "Rajesh Sharma",
      "phone_number": "+91 9876543210",
      "ward": "Ward 15",
      "email": "rajesh@gmail.com"
    },
    {
      "citizen_id": 2,
      "name": "Priya Desai",
      "phone_number": "+91 9876543211",
      "ward": "Ward 12",
      "email": "priya@gmail.com"
    }
  ]
}
```

---

### Get Citizen Details

**Endpoint:** `GET /admin/userdetails`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Citizen/User ID |

**Example:**
```
GET /admin/userdetails?id=1
```

**Response (200):**
```json
{
  "success": true,
  "message": "Citizen details fetched successfully",
  "data": {
    "citizen_id": 1,
    "name": "Rajesh Sharma",
    "phone_number": "+91 9876543210",
    "email": "rajesh@gmail.com",
    "ward": "Ward 15",
    "aadhar_number": "7539 4665 4574",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "address": "123 Main Street",
    "blood_group": "O+ve",
    "disability": "None",
    "language": "English"
  }
}
```

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| citizen_id | integer | Unique citizen ID |
| name | string | Full name |
| phone_number | string | Contact phone |
| email | string | Email address |
| ward | string | Ward name |
| aadhar_number | string | Aadhar number (partial) |
| city | string | City |
| state | string | State |
| address | string | Full address |
| blood_group | string | Blood group |
| disability | string | Disability status |
| language | string | Preferred language |

---

## Complaints

### Get Ward Complaints

**Endpoint:** `GET /admin/complaints/my`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| councillorId | integer | Yes | Councillor/Ward ID |
| status | string | No | Filter by status (IN_PROGRESS, COMPLETED, SUBMITTED, etc.) |
| category | string | No | Filter by category name |
| ward | string | No | Filter by ward ID |
| limit | integer | No | Results per page (default: 20) |
| offset | integer | No | Pagination offset (default: 0) |

**Example:**
```
GET /admin/complaints/my?councillorId=1&status=IN_PROGRESS&limit=20&offset=0
```

**Response (200):**
```json
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
      "date": "2024-12-05"
    },
    {
      "complaint_id": "CMP234568",
      "category": "Garbage Collection",
      "summary": "Garbage not collected for 3 days",
      "status": "SUBMITTED",
      "ward": "Ward 12",
      "date": "2024-12-05"
    }
  ]
}
```

---

### Get Complaint Details

**Endpoint:** `GET /complaints/{id}`

**Authentication:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint details fetched successfully",
  "data": {
    "complaint_id": "CMP234567",
    "category": "Street Lights",
    "title": "Broken street light on MG Road",
    "description": "The street light near Shop No. 45 has been broken for 3 days",
    "status": "IN_PROGRESS",
    "date": "2024-12-05",
    "location": "MG Road, Ward 15",
    "citizen": {
      "name": "Rahul Sharma",
      "phone": "+91 9876543210"
    }
  }
}
```

---

### Get Complaint Timeline Stages

**Endpoint:** `GET /complaints/timeline`

**Authentication:** Required

**Description:** Returns available complaint status stages.

**Response (200):**
```json
{
  "success": true,
  "message": "Timeline stages retrieved",
  "data": [
    "SUBMITTED",
    "SEEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CITIZEN_CONFIRMED",
    "CLOSED",
    "REJECTED"
  ]
}
```

---

### Get Complaint Timeline History

**Endpoint:** `GET /complaints/timeline/{complaintId}`

**Authentication:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| complaintId | integer | Complaint ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Timeline retrieved",
  "data": [
    {
      "status": "SUBMITTED",
      "at": "2024-12-05T10:30:00Z"
    },
    {
      "status": "SEEN",
      "at": "2024-12-05T10:45:00Z"
    },
    {
      "status": "IN_PROGRESS",
      "at": "2024-12-05T11:00:00Z"
    }
  ]
}
```

---

## Officers

### Get Officers List

**Endpoint:** `GET /officers`

**Authentication:** Required

**Description:** Returns all officers/employees in the system.

**Response (200):**
```json
{
  "success": true,
  "message": "Officers fetched successfully",
  "data": [
    {
      "officer_id": 1,
      "name": "Rajesh Sharma",
      "phone_number": "+91 9876543210"
    },
    {
      "officer_id": 2,
      "name": "Amit Kumar",
      "phone_number": "+91 9876543211"
    }
  ]
}
```

---

## Councillors (Super Admin)

### List Users (Super Admin Table)

**Endpoint:** `GET /admin/councillors`

**Authentication:** Required (councillor_admin role)

**Description:** Returns users for the super admin table (citizen, councillor, ward admin, officer) with optional filters.

**Optional Query Params:**
- `role` = `citizen` | `councillor` | `ward_admin` | `officer`
- `district` = district name
- `corporation_id` = city/corporation id
- `corporation` = city/corporation name
- `ward_id` = ward id
- `ward` = ward name

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Rajesh Sharma",
      "phone": "+91 9876543210",
      "role": "councillor",
      "ward_id": 15,
      "ward": "Ward 15",
      "corporation_id": 2,
      "corporation": "Pune Municipal Corporation",
      "district": "Pune",
      "status": "active"
    }
  ]
}
```

---

### Create Councillor

**Endpoint:** `POST /admin/councillors`

**Authentication:** Required (councillor_admin role)

**Request Body:**
```json
{
  "name": "Amit Kumar",
  "phone": "+91 9876543212",
  "ward": 8
}
```

**Request Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name |
| phone | string | Yes | Phone number (must be unique) |
| ward | integer | Yes | Ward ID |

**Response (201):**
```json
{
  "success": true,
  "message": "Councillor created successfully",
  "data": {
    "id": 3,
    "name": "Amit Kumar",
    "phone": "+91 9876543212",
    "ward": 8,
    "status": "active"
  }
}
```

---

### Update Councillor

**Endpoint:** `PUT /admin/councillors/{id}`

**Authentication:** Required (councillor_admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Councillor ID |

**Request Body:**
```json
{
  "name": "Rajesh Sharma Updated",
  "phone": "+91 9876549999",
  "ward": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Councillor updated successfully",
  "data": {
    "id": 1,
    "name": "Rajesh Sharma Updated",
    "phone": "+91 9876549999",
    "ward": 20,
    "status": "active"
  }
}
```

---

### Delete Councillor

**Endpoint:** `DELETE /admin/councillors/{id}`

**Authentication:** Required (councillor_admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Councillor ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Councillor deleted successfully"
}
```

---

## Councillor Actions

### Approve Complaint

**Endpoint:** `PUT /councillor/approve/{id}`

**Authentication:** Required

**Description:** Marks complaint as approved/seen.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint approved"
}
```

---

### Mark In Progress

**Endpoint:** `PUT /councillor/in-progress/{id}`

**Authentication:** Required

**Description:** Marks complaint as in-progress.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint marked as in progress"
}
```

---

### Mark Completed

**Endpoint:** `PUT /councillor/complete/{id}`

**Authentication:** Required

**Request Body (Optional):**
```json
{
  "resolution_notes": "Issue resolved successfully"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint completed"
}
```

---

### Confirm Resolution

**Endpoint:** `PUT /councillor/confirm/{id}`

**Authentication:** Required

**Description:** Confirms/marks complaint as resolved with resolution note.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Request Body:**
```json
{
  "resolution_note": "Issue resolved successfully"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint marked as completed"
}
```

---

### Add Note

**Endpoint:** `POST /councillor/note/{id}`

**Authentication:** Required

**Description:** Adds internal note to complaint.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Request Body:**
```json
{
  "note": "Internal note about the complaint"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Note added"
}
```

---

## AI Features

### Get Complaint Summary

**Endpoint:** `GET /ai/summary/{complaintId}`

**Authentication:** Required

**Description:** Generates AI-powered summary for a complaint (requires OpenAI API key).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| complaintId | integer | Complaint ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Summary generated",
  "data": {
    "summary": "Issue related to Street Lights. Assigned to Ward 15. Estimated resolution in 2–3 days."
  }
}
```

---

## Response Format

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": "Specific error message"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed, missing fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

### Common Error Messages

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "category_name": "Category name is required",
    "phone_number": "Phone number must be unique"
  }
}
```

---

## Authentication Header Example

```
curl -X GET "http://localhost:3000/api/admin/dashboard-stats" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Rate Limiting

Currently no rate limiting is enforced. Future versions may implement:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-29 | Initial release with all endpoints |

---

## Support

For API support or issues, contact: support@example.com
