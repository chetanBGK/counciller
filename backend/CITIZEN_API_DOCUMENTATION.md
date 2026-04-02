# Citizen API Documentation

**Base URL**: `https://councillor-app123.vercel.app/api`  
**Version**: 1.0.0  
**Content-Type**: `application/json`  
**Last Updated**: January 24, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Complaints](#complaints)
4. [Announcements](#announcements)
5. [Notifications](#notifications)

### Manage Citizens (Ward Admin)

**Endpoint:** `DELETE /api/admin/user/:id`

**Description:** Mark a citizen as deleted (soft-delete). This route is restricted to users with the `ward_admin` role. A ward admin may only delete citizens who belong to their own ward.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | ID of the citizen to delete |

**Behavior & Notes:**
- Only users with role `citizen` can be deleted via this endpoint; requests to delete other roles will be rejected.
- The route enforces ward scoping: a `ward_admin` cannot delete a citizen from another ward (403 Forbidden).
- The operation records an audit entry with action `DELETE_CITIZEN`.

**Success Response** (200):
```json
{
  "success": true,
  "message": "Citizen deleted successfully",
  "data": {}
}
```

**Error Responses:**
- 400 Bad Request: Missing or invalid `id` parameter.
- 403 Forbidden: Caller is not a `ward_admin` or is attempting to delete a citizen from another ward.
- 404 Not Found: User not found or user is not a citizen.
- 500 Internal Server Error: Unexpected server error.

**Example Request (curl):**
```bash
curl -X DELETE "https://your-host.example.com/api/admin/user/123" \
  -H "Authorization: Bearer <token>"
```

**Implementation Details:**
- Route defined in `src/routes/admin.routes.js` as `router.delete('/user/:id', authMiddleware, roleMiddleware('ward_admin'), adminControllers.deleteCitizen)`.
- Controller: `src/controllers/admin.controller.js` — validates ward scope and existence before calling the service.
- Service: `src/services/admin.service.js` — verifies the user exists and has role `citizen`, calls `adminModel.deleteCitizen`, and logs audit entry.

## Complaints

---

## Authentication

All endpoints (except OTP sending) require a Bearer token in the `Authorization` header.

### 1. Send OTP

**Endpoint**: `POST /auth/send-otp`

**Description**: Send a one-time password to a phone number for authentication

**Headers**: None required

**Request**:
```json
{
  "phone": "+919876543210"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | Yes | Phone number in E.164 format (e.g., +91XXXXXXXXXX) |

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+919876543210",
    "expires_in": 300
  }
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| phone | string | Phone number OTP was sent to |
| expires_in | integer | OTP expiration time in seconds (5 minutes) |

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid phone number format",
  "data": null
}
```

---

### 2. Verify OTP & Login

**Endpoint**: `POST /auth/verify-otp`

**Description**: Verify OTP and receive JWT token for authentication

**Headers**: None required

**Request**:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | Yes | Phone number (must match send-otp request) |
| otp | string | Yes | 6-digit OTP received via SMS |

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiI...",
    "user": {
      "id": 1,
      "phone": "+919876543210",
      "name": "Rajesh Sharma",
      "role": "citizen",
      "created_at": "2024-12-06T10:00:00Z"
    }
  }
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| token | string | JWT token for API authentication |
| user.id | integer | User ID in system |
| user.phone | string | User's phone number |
| user.name | string | User's full name |
| user.role | string | User role (always "citizen" for citizens) |
| user.created_at | string | Account creation timestamp |

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid OTP",
  "data": null
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "OTP expired. Please request a new one",
  "data": null
}
```

---

## User Profile

### 1. Get User Profile

**Endpoint**: `GET /user/me`

**Description**: Retrieve authenticated user's profile information

**Headers**: 
```
Authorization: Bearer <token>
```

**Query Parameters**: None

**Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "phone": "+919876543210",
    "name": "Rajesh Sharma",
    "email": "rajesh@example.com",
    "gender": "male",
    "dob": "1990-05-15",
    "language": "en",
    "profile_photo": "https://s3.amazonaws.com/...",
    "disability": "None",
    "aadhar_number": "xxxx xxxx 4574",
    "blood_group": "O+ve",
    "municipal_corporation": "Chennai Corporation",
    "ward_id": 5,
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "area": "Downtown",
    "landmark": "Near City Hall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "role": "citizen",
    "created_at": "2024-12-06T10:00:00Z",
    "updated_at": "2024-12-20T15:30:00Z"
  }
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| id | integer | User ID |
| phone | string | Phone number |
| name | string | Full name |
| email | string | Email address |
| gender | string | Gender (male/female/other) |
| dob | string | Date of birth (YYYY-MM-DD) |
| language | string | Preferred language (en/hi/etc) |
| profile_photo | string | URL to profile photo |
| disability | string | Disability status |
| aadhar_number | string | Aadhar number (partially masked) |
| blood_group | string | Blood group |
| municipal_corporation | string | Municipal corporation name |
| ward_id | integer | Assigned ward ID |
| address_line1 | string | Primary address |
| address_line2 | string | Secondary address |
| area | string | Area/locality name |
| landmark | string | Nearby landmark |
| city | string | City |
| state | string | State |
| pincode | string | Postal code |
| latitude | number | Geographic latitude |
| longitude | number | Geographic longitude |
| role | string | User role (citizen) |
| created_at | string | Account creation timestamp |
| updated_at | string | Last profile update timestamp |

**Error Response** (401):
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

---

### 2. Update User Profile

**Endpoint**: `PUT /user/update`

**Description**: Update citizen's profile information (personal details)

**Headers**: 
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "name": "Rajesh Sharma Updated",
  "email": "rajesh.new@example.com",
  "gender": "male",
  "dob": "1990-05-15",
  "language": "hi",
  "profile_photo": "https://...",
  "disability": "None",
  "aadhar_number": "7539 4665 4574",
  "blood_group": "A+ve",
  "municipal_corporation": "Chennai Corporation"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Full name |
| email | string | No | Email address |
| gender | string | No | Gender (male/female/other) |
| dob | string | No | Date of birth (YYYY-MM-DD) |
| language | string | No | Preferred language code |
| profile_photo | string | No | URL to profile photo |
| disability | string | No | Disability status |
| aadhar_number | string | No | Aadhar number |
| blood_group | string | No | Blood group |
| municipal_corporation | string | No | Municipal corporation name |

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "Rajesh Sharma Updated",
    "email": "rajesh.new@example.com",
    "gender": "male",
    "dob": "1990-05-15",
    "language": "hi",
    "blood_group": "A+ve",
    "updated_at": "2024-12-20T15:30:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid email format",
  "data": null
}
```

---

### 3. Update User Location

**Endpoint**: `PUT /user/location`

**Description**: Update citizen's residential location and address

**Headers**: 
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "address_line1": "456 Oak Avenue",
  "address_line2": "Apt 5C",
  "area": "Midtown",
  "landmark": "Near Railway Station",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "latitude": 19.0880,
  "longitude": 72.8680,
  "geo_hash": "tdr4u9"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| address_line1 | string | No | Primary address |
| address_line2 | string | No | Secondary address/apartment number |
| area | string | No | Area/locality name |
| landmark | string | No | Nearby landmark for reference |
| city | string | No | City name |
| state | string | No | State name |
| pincode | string | No | Postal code |
| latitude | number | No | Geographic latitude |
| longitude | number | No | Geographic longitude |
| geo_hash | string | No | Geohash for location indexing |

**Response** (200):
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "address_line1": "456 Oak Avenue",
    "address_line2": "Apt 5C",
    "area": "Midtown",
    "landmark": "Near Railway Station",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002",
    "latitude": 19.0880,
    "longitude": 72.8680,
    "last_location_update": "2024-12-20T15:35:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid latitude/longitude",
  "data": null
}
```

---



## Complaints

### 1. Create Complaint

**Endpoint**: `POST /complaints`

**Description**: Create a new complaint about a civic issue

**Headers**: 
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data)**:
```
title: "Pothole on Main Street"
description: "Large pothole causing traffic congestion and accidents"
category_id: 3
priority: "high"
severity: "medium"
address_line1: "123 Main Street"
area: "Downtown"
landmark: "Near City Hall"
city: "Mumbai"
state: "Maharashtra"
pincode: "400001"
latitude: 19.0760
longitude: 72.8777
metadata: {}
files: [file1.jpg, file2.pdf] (up to 5 files)
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Complaint title/subject (max 255 chars) |
| description | string | Yes | Detailed description of issue |
| category_id | integer | No | Category ID (e.g., 1=Roads, 2=Street Lights, 3=Water Supply) |
| ward_id | integer | No | Ward ID (auto-set from user's ward if not provided) |
| priority | string | No | Priority level: low/medium/high (default: medium) |
| severity | string | No | Severity level: low/medium/high |
| address_line1 | string | No | Address where issue occurred |
| address_line2 | string | No | Secondary address/apartment number |
| area | string | No | Area/locality name |
| landmark | string | No | Nearby landmark for reference |
| city | string | No | City name |
| state | string | No | State name |
| pincode | string | No | Postal code |
| latitude | number | No | Geographic latitude of issue location |
| longitude | number | No | Geographic longitude of issue location |
| metadata | object | No | Additional metadata as JSON |
| files | array | No | Attachment files (JPEG, PNG, WebP, PDF; max 10MB each, up to 5 files) |

**Response** (201):
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic congestion and accidents",
    "status": "submitted",
    "priority": "high",
    "category_id": 3,
    "ward_id": 5,
    "reporter_id": 1,
    "created_at": "2024-12-20T15:40:00Z",
    "updated_at": "2024-12-20T15:40:00Z"
  }
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Complaint ID |
| user_id | integer | ID of complaint creator |
| title | string | Complaint title |
| description | string | Detailed description |
| status | string | Current status (submitted/seen/in_progress/resolved/closed) |
| priority | string | Priority level |
| category_id | integer | Category ID |
| ward_id | integer | Assigned ward ID |
| reporter_id | integer | User who filed complaint |
| created_at | string | Creation timestamp |
| updated_at | string | Last update timestamp |

**Error Response** (400):
```json
{
  "success": false,
  "message": "title and description required",
  "data": null
}
```

**Error Response** (413):
```json
{
  "success": false,
  "message": "File size exceeds 10MB limit",
  "data": null
}
```

---

### 2. Get My Complaints

**Endpoint**: `GET /complaints/my?limit=20&offset=0&status=<status>`

**Description**: Retrieve all complaints filed by the current user

**Headers**: 
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 20 | Number of records to return |
| offset | integer | No | 0 | Number of records to skip |
| status | string | No | - | Filter by status (submitted/seen/in_progress/resolved/closed) |

**Example**:
```
GET /complaints/my?limit=20&offset=0&status=in_progress
```

**Response** (200):
```json
{
  "success": true,
  "message": "Complaints retrieved",
  "data": [
    {
      "id": 42,
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic congestion",
      "status": "in_progress",
      "priority": "high",
      "category_id": 3,
      "ward_id": 5,
      "created_at": "2024-12-20T15:40:00Z",
      "updated_at": "2024-12-20T16:00:00Z"
    },
    {
      "id": 43,
      "title": "Broken street light",
      "description": "Street light not working on Oak Avenue",
      "status": "submitted",
      "priority": "medium",
      "category_id": 2,
      "ward_id": 5,
      "created_at": "2024-12-19T10:15:00Z",
      "updated_at": "2024-12-19T10:15:00Z"
    }
  ]
}
```

---

### 3. Get Complaint Details

**Endpoint**: `GET /complaints/:id`

**Description**: Retrieve detailed information about a specific complaint

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Example**:
```
GET /complaints/42
```

**Response** (200):
```json
{
  "success": true,
  "message": "Complaint details retrieved",
  "data": {
    "id": 42,
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic congestion and accidents",
    "status": "in_progress",
    "priority": "high",
    "severity": "medium",
    "category_id": 3,
    "category_name": "Roads & Potholes",
    "ward_id": 5,
    "ward_name": "Ward 5",
    "reporter_id": 1,
    "reporter": {
      "id": 1,
      "name": "Rajesh Sharma",
      "phone": "+919876543210",
      "email": "rajesh@example.com"
    },
    "councillor_id": 10,
    "councillor_name": "Jane Smith",
    "councillor_phone": "+919876543220",
    "location": {
      "address_line1": "123 Main Street",
      "area": "Downtown",
      "landmark": "Near City Hall",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "attachments": [
      {
        "id": 1,
        "filename": "pothole_photo.jpg",
        "file_type": "image/jpeg",
        "file_size": 2048576,
        "storage_key": "complaints/42/1703086800000_pothole_photo.jpg",
        "uploaded_by": 1,
        "uploaded_at": "2024-12-20T15:40:00Z"
      },
      {
        "id": 2,
        "filename": "damage_report.pdf",
        "file_type": "application/pdf",
        "file_size": 1048576,
        "storage_key": "complaints/42/1703086820000_damage_report.pdf",
        "uploaded_by": 1,
        "uploaded_at": "2024-12-20T15:41:00Z"
      }
    ],
    "timeline": [
      {
        "status": "SUBMITTED",
        "date": "2024-12-20T15:40:00Z",
        "label": "Complaint Submitted",
        "actor": "You"
      },
      {
        "status": "SEEN",
        "date": "2024-12-20T16:00:00Z",
        "label": "Seen by Ward Admin",
        "actor": "Jane Smith"
      },
      {
        "status": "IN_PROGRESS",
        "date": "2024-12-20T16:30:00Z",
        "label": "Work Started",
        "actor": "Jane Smith",
        "note": "Assigned to contractor ABC Ltd"
      }
    ],
    "created_at": "2024-12-20T15:40:00Z",
    "updated_at": "2024-12-20T16:30:00Z",
    "resolved_at": null
  }
}
```

**Response Schema**:
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Complaint ID |
| title | string | Complaint title |
| description | string | Detailed description |
| status | string | Current status |
| priority | string | Priority level |
| severity | string | Severity level |
| category_name | string | Category name |
| ward_name | string | Ward name |
| reporter | object | Reporter information |
| councillor_name | string | Assigned councillor name |
| location | object | Issue location details |
| attachments | array | Uploaded files and photos |
| timeline | array | Status change history |
| created_at | string | Creation timestamp |
| updated_at | string | Last update timestamp |
| resolved_at | string | Resolution timestamp (if applicable) |

**Error Response** (404):
```json
{
  "success": false,
  "message": "Complaint not found",
  "data": null
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "You do not have access to this complaint",
  "data": null
}
```

---

### 4. Get Complaint Timeline

**Endpoint**: `GET /complaints/timeline/:id`

**Description**: Get the complete history of status changes and updates for a complaint

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Complaint timeline retrieved",
  "data": [
    {
      "id": 1,
      "status": "SUBMITTED",
      "date": "2024-12-20T15:40:00Z",
      "label": "Complaint Submitted",
      "actor_name": "Rajesh Sharma",
      "note": "Complaint submitted by citizen",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 2,
      "status": "SEEN",
      "date": "2024-12-20T16:00:00Z",
      "label": "Seen by Ward Admin",
      "actor_name": "Jane Smith",
      "note": "Complaint viewed by ward administrator",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 3,
      "status": "IN_PROGRESS",
      "date": "2024-12-20T16:30:00Z",
      "label": "Work Started",
      "actor_name": "Jane Smith",
      "note": "Assigned to contractor ABC Ltd for repair",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 4,
      "status": "RESOLVED",
      "date": "2024-12-22T14:00:00Z",
      "label": "Resolved",
      "actor_name": "Jane Smith",
      "note": "Pothole has been filled. Road is now safe.",
      "event_type": "STATUS_CHANGE"
    }
  ]
}
```

---

### 5. Upload Complaint Attachment

**Endpoint**: `POST /complaints/:id/attachments`

**Description**: Upload additional attachments/photos to an existing complaint

**Headers**: 
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Complaint ID |

**Request Body (Form Data)**:
```
file: <image or pdf file> (max 10MB)
```

**Supported File Types**: JPEG, PNG, WebP, PDF

**Response** (200):
```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {
    "id": 3,
    "complaint_id": 42,
    "filename": "additional_photo.jpg",
    "file_type": "image/jpeg",
    "file_size": 1536000,
    "storage_key": "complaints/42/1703164800000_additional_photo.jpg",
    "uploaded_by": 1,
    "uploaded_at": "2024-12-21T10:00:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Unsupported file type",
  "data": null
}
```

---

### 6. Download Complaint Attachment

**Endpoint**: `GET /complaints/attachments/:id/download`

**Description**: Download a complaint attachment (returns presigned URL)

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Attachment ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Download URL generated",
  "data": {
    "download_url": "https://s3.amazonaws.com/...",
    "filename": "pothole_photo.jpg",
    "expires_in": 3600
  }
}
```

---

### 7. Get Timeline Stages

**Endpoint**: `GET /complaints/timeline`

**Description**: Get list of all available complaint status stages

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200):
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

## Announcements

### 1. Get Public Announcements

**Endpoint**: `GET /user/announcements?limit=20&offset=0`

**Description**: Retrieve public announcements from ward administrators

**Headers**: 
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 20 | Number of announcements to return |
| offset | integer | No | 0 | Number of announcements to skip |

**Response** (200):
```json
{
  "success": true,
  "message": "Announcements retrieved",
  "data": [
    {
      "id": 1,
      "title": "Scheduled Water Supply Maintenance",
      "description": "Water supply will be shut down on January 25, 2026 from 8 AM to 4 PM for scheduled maintenance. Citizens are requested to store water accordingly.",
      "image_url": "https://s3.amazonaws.com/...",
      "created_by": 10,
      "created_by_name": "Jane Smith",
      "created_by_phone": "+919876543220",
      "target_ward": 5,
      "priority": "high",
      "created_at": "2024-01-20T09:00:00Z",
      "updated_at": "2024-01-20T09:00:00Z"
    },
    {
      "id": 2,
      "title": "Road Repair Work on Oak Avenue",
      "description": "Repair work will commence on Oak Avenue starting January 28. Please avoid the area during peak hours. Estimated completion: 2 weeks.",
      "image_url": "https://s3.amazonaws.com/...",
      "created_by": 10,
      "created_by_name": "Jane Smith",
      "created_by_phone": "+919876543220",
      "target_ward": 5,
      "priority": "medium",
      "created_at": "2024-01-18T14:30:00Z",
      "updated_at": "2024-01-18T14:30:00Z"
    }
  ]
}
```

---

### 2. Get Announcement Details

**Endpoint**: `GET /user/announcements/:id`

**Description**: Get full details of a specific announcement

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Announcement ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Announcement details retrieved",
  "data": {
    "id": 1,
    "title": "Scheduled Water Supply Maintenance",
    "description": "Water supply will be shut down on January 25, 2026 from 8 AM to 4 PM for scheduled maintenance. Citizens are requested to store water accordingly. Normal supply will resume by 6 PM.",
    "image_url": "https://s3.amazonaws.com/...",
    "created_by": 10,
    "created_by_name": "Jane Smith",
    "created_by_phone": "+919876543220",
    "target_ward": 5,
    "priority": "high",
    "status": "active",
    "created_at": "2024-01-20T09:00:00Z",
    "updated_at": "2024-01-20T09:00:00Z"
  }
}
```

---

## Notifications

### 1. Get Notifications

**Endpoint**: `GET /notifications?limit=20&offset=0`

**Description**: Retrieve user's notifications (complaint updates, announcements, etc.)

**Headers**: 
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 20 | Number of notifications to return |
| offset | integer | No | 0 | Number of notifications to skip |

**Response** (200):
```json
{
  "success": true,
  "message": "Notifications retrieved",
  "data": [
    {
      "id": 1,
      "type": "complaint_status_update",
      "title": "Your complaint has been marked in progress",
      "message": "Your complaint 'Pothole on Main Street' is now being worked on.",
      "complaint_id": 42,
      "read": false,
      "created_at": "2024-12-21T10:00:00Z"
    },
    {
      "id": 2,
      "type": "complaint_resolved",
      "title": "Complaint Resolved",
      "message": "Your complaint 'Broken street light' has been resolved. Please confirm.",
      "complaint_id": 43,
      "read": false,
      "created_at": "2024-12-21T14:30:00Z"
    },
    {
      "id": 3,
      "type": "announcement",
      "title": "Important Announcement",
      "message": "Scheduled water supply maintenance on January 25, 2026",
      "announcement_id": 1,
      "read": true,
      "created_at": "2024-01-20T09:00:00Z"
    }
  ]
}
```

---

### 2. Mark Notification as Read

**Endpoint**: `PUT /notifications/read/:id`

**Description**: Mark a single notification as read

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Notification ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 1,
    "read": true
  }
}
```

---

### 3. Mark All Notifications as Read

**Endpoint**: `PUT /notifications/read-all`

**Description**: Mark all user's notifications as read

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "marked_as_read": 15
  }
}
```

---

### 4. Get Unread Notification Count

**Endpoint**: `GET /notifications/unread-count`

**Description**: Get count of unread notifications

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Unread count retrieved",
  "data": {
    "unread_count": 5
  }
}
```

---

### 5. Delete Notification

**Endpoint**: `DELETE /notifications/:id`

**Description**: Delete a notification

**Headers**: 
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Notification ID |

**Response** (200):
```json
{
  "success": true,
  "message": "Notification deleted",
  "data": {
    "id": 1
  }
}
```

---

## Response Format

All API responses follow a standardized format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Description of what was done",
  "data": {}
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "Description of error",
  "data": null
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters or malformed data |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized for this action |
| 404 | Not Found | Requested resource does not exist |
| 413 | Payload Too Large | File size exceeds limit |
| 500 | Server Error | Internal server error |

### Common Error Messages

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Invalid OTP | 400 | Incorrect OTP entered | Verify OTP from SMS and try again |
| OTP expired | 401 | OTP was not verified within 5 minutes | Request a new OTP |
| Unauthorized | 401 | Missing or invalid token | Login again to get a new token |
| Not found | 404 | Complaint/notification doesn't exist | Verify the ID and try again |
| Unsupported file type | 400 | File type not allowed | Use JPEG, PNG, WebP, or PDF |
| File too large | 413 | File exceeds 10MB limit | Reduce file size and try again |

---

## Testing Examples

### Using cURL

#### 1. Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210"
  }'
```

#### 2. Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "123456"
  }'
```

#### 3. Get User Profile
```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Create Complaint with Attachments
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "title=Pothole on Main Street" \
  -F "description=Large pothole causing accidents" \
  -F "category_id=3" \
  -F "priority=high" \
  -F "files=@/path/to/photo1.jpg" \
  -F "files=@/path/to/photo2.jpg"
```

#### 5. Get My Complaints
```bash
curl -X GET "http://localhost:3000/api/complaints/my?limit=20&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 6. Get Complaint Details
```bash
curl -X GET http://localhost:3000/api/complaints/42 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 7. Get Notifications
```bash
curl -X GET "http://localhost:3000/api/notifications?limit=20&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 8. Mark Notification as Read
```bash
curl -X PUT http://localhost:3000/api/notifications/read/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Using Postman

1. **Create Environment** with variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (obtained after login)
   - `phone`: +919876543210

2. **Import Collection** (see postman_collection.json)

3. **Run Requests** in sequence:
   - Send OTP
   - Verify OTP (copy token to environment variable)
   - Get Profile
   - Create Complaint
   - Get My Complaints

---

## Authentication Flow

1. **Send OTP**
   ```
   POST /auth/send-otp
   {phone: "+919876543210"}
   → Returns success message
   ```

2. **Receive OTP via SMS** (in development, check logs/database)

3. **Verify OTP**
   ```
   POST /auth/verify-otp
   {phone: "+919876543210", otp: "123456"}
   → Returns JWT token
   ```

4. **Use Token for Requests**
   ```
   All subsequent requests include:
   Authorization: Bearer <token>
   ```

5. **Token Expiration**: Token is valid for 24 hours (configurable)

---

## Rate Limiting

Currently no rate limiting is implemented. Recommended limits for production:
- **Public endpoints** (OTP): 5 requests per minute per phone number
- **Authenticated endpoints**: 100 requests per minute per user
- **File uploads**: 10 requests per minute per user

---

## Pagination

All list endpoints support pagination:

```
?limit=20&offset=0
```

- **limit**: Number of records (default: 20, max: 100)
- **offset**: Number of records to skip (default: 0)

**Example**:
```
GET /complaints/my?limit=50&offset=100
```

---

## Data Types

| Type | Format | Example |
|------|--------|---------|
| String | UTF-8 text | "Hello World" |
| Integer | Whole number | 42 |
| Number | Decimal | 19.0760 |
| Boolean | true/false | true |
| DateTime | ISO 8601 | 2024-12-20T15:40:00Z |
| Array | JSON array | [1, 2, 3] |
| Object | JSON object | {"key": "value"} |

---

## CORS Headers

All responses include CORS headers to allow cross-origin requests from frontend applications.

---

## Support & Troubleshooting

### Common Issues

**Q: I'm getting "Invalid OTP"**
- A: Ensure you're using the correct 6-digit OTP received via SMS
- Check OTP expiration (valid for 5 minutes)
- Try requesting a new OTP

**Q: Token expired error**
- A: Re-login to get a new token
- Tokens are valid for 24 hours by default

**Q: File upload fails**
- A: Check file size (max 10MB)
- Verify file type (JPEG, PNG, WebP, PDF)
- Ensure proper Content-Type header

**Q: Can't find my complaint**
- A: Verify the complaint ID
- Ensure you're using correct authorization token
- Check if complaint status has filters applied

---

## API Version & Changelog

**Current Version**: 1.0.0

### Version 1.0.0 (January 24, 2026)
- Initial release with complete citizen API documentation
- Authentication via OTP
- User profile management
- Complaint creation and tracking
- Notifications and announcements
- File attachment support

---

**Last Updated**: January 24, 2026  
**Maintained By**: Ward Complaint Management System Development Team
