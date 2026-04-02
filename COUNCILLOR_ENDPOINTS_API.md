# Councillor Mobile App - API Endpoints

**Base URL:** `http://your-server-url/api`

**Authentication:** All endpoints require Bearer token in Authorization header
```
Authorization: Bearer <jwt_token>
```

---

## 1. Profile & Dashboard

### Get Councillor Profile
```
GET /councillor/me
```
**Description:** Get current councillor's profile information with statistics

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Councillor profile retrieved",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "ward_id": "ward_123",
    "ward_name": "Ward A",
    "role": "councillor",
    "total_completed_complaints": 45,
    "current_month_stats": { ... }
  }
}
```

---

### Get Dashboard
```
GET /councillor/dashboard
```
**Description:** Get councillor dashboard with overall statistics and metrics

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Dashboard retrieved",
  "data": {
    "total_complaints": 120,
    "pending_complaints": 30,
    "in_progress_complaints": 25,
    "resolved_complaints": 65,
    "total_citizens": 500,
    "total_ward_admins": 5,
    "recent_complaints": [ ... ],
    "monthly_stats": { ... }
  }
}
```

---

## 2. Complaint Management

### Get Complaints
```
GET /councillor/complaints?status=<status>&limit=<limit>&offset=<offset>
```
**Description:** Get all complaints for the councillor's ward with optional filtering

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `approved`, `in_progress`, `resolved`, `confirmed`
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Complaints retrieved",
  "data": {
    "total": 120,
    "limit": 20,
    "offset": 0,
    "complaints": [
      {
        "id": "complaint_id",
        "title": "Pothole on Main Street",
        "description": "Large pothole near market",
        "status": "pending",
        "category_id": "cat_123",
        "category_name": "Roads",
        "reporter_name": "Jane Smith",
        "reporter_phone": "9876543210",
        "location": "Main Street, Ward A",
        "created_at": "2025-01-20T10:30:00Z",
        "attachments": [ ... ],
        "priority": "medium"
      }
    ]
  }
}
```

---

### Approve Complaint
```
PUT /councillor/approve/:id
```
**Description:** Approve a complaint to proceed with resolution

**Parameters:**
- `id` (path): Complaint ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Complaint approved",
  "data": {
    "id": "complaint_id",
    "status": "approved",
    "updated_at": "2025-01-25T14:30:00Z"
  }
}
```

---

### Mark Complaint In Progress
```
PUT /councillor/in-progress/:id
```
**Description:** Mark a complaint as currently being worked on

**Parameters:**
- `id` (path): Complaint ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Complaint marked as in progress",
  "data": {
    "id": "complaint_id",
    "status": "in_progress",
    "updated_at": "2025-01-25T14:30:00Z"
  }
}
```

---

### Complete Complaint
```
PUT /councillor/complete/:id
```
**Description:** Mark complaint as completed with resolution notes

**Parameters:**
- `id` (path): Complaint ID

**Request Body:**
```json
{
  "resolution_notes": "Pothole has been filled and road repaired"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint completed",
  "data": {
    "id": "complaint_id",
    "status": "completed",
    "resolution_notes": "...",
    "resolved_at": "2025-01-25T14:30:00Z"
  }
}
```

---

### Confirm Complaint (After Citizen Confirmation)
```
PUT /councillor/confirm/:id
```
**Description:** Mark complaint as confirmed after citizen verifies resolution

**Parameters:**
- `id` (path): Complaint ID

**Request Body:**
```json
{
  "resolution_note": "Citizen confirmed resolution on site"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint marked as completed",
  "data": {
    "id": "complaint_id",
    "status": "confirmed",
    "confirmed_at": "2025-01-25T14:30:00Z"
  }
}
```

---

### Add Note to Complaint
```
POST /councillor/note/:id
```
**Description:** Add an internal note to a complaint for tracking updates

**Parameters:**
- `id` (path): Complaint ID

**Request Body:**
```json
{
  "note": "Assigned to street maintenance team"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note added",
  "data": {
    "id": "complaint_id",
    "note": "Assigned to street maintenance team",
    "added_at": "2025-01-25T14:30:00Z",
    "added_by": "councillor_name"
  }
}
```

---

## 3. Ward Citizens Management

### Get Ward Citizens
```
GET /councillor/ward-citizens?limit=<limit>&offset=<offset>
```
**Description:** Get list of all citizens in the councillor's ward

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Ward citizens retrieved",
  "data": {
    "total": 500,
    "limit": 20,
    "offset": 0,
    "citizens": [
      {
        "citizen_id": "user_123",
        "name": "Jane Smith",
        "phone_number": "9876543210",
        "email": "jane@example.com",
        "ward": "Ward A",
        "city": "City Name",
        "state": "State Name",
        "voter_id": "voter_123"
      }
    ]
  }
}
```

---

## 4. Ward Administrators Management

### Get Ward Admins
```
GET /councillor/ward-admins
```
**Description:** Get list of all ward administrators in the councillor's ward

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Ward admins retrieved",
  "data": [
    {
      "admin_id": "user_456",
      "name": "Admin Name",
      "email": "admin@example.com",
      "phone": "1234567890",
      "password": "SET",
      "created_at": "2025-01-15T10:30:00Z",
      "assigned_by": "Councillor Name"
    }
  ]
}
```

---

### Promote Citizen to Ward Admin
```
POST /councillor/promote-citizen
```
**Description:** Promote a citizen to ward administrator role

**Request Body:**
```json
{
  "citizen_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Citizen promoted to Ward Admin",
  "data": {
    "admin_id": "user_123",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "A1B2C3",
    "role": "councillor_admin",
    "promoted_at": "2025-01-25T14:30:00Z",
    "promoted_by": "Councillor Name"
  }
}
```

---

### Demote Ward Admin to Citizen
```
DELETE /councillor/ward-admin/:admin_id
```
**Description:** Demote a ward administrator back to citizen role

**Parameters:**
- `admin_id` (path): Ward Admin User ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Ward Admin demoted to Citizen",
  "data": {
    "user_id": "user_456",
    "name": "Admin Name",
    "role": "citizen",
    "demoted_at": "2025-01-25T14:30:00Z",
    "demoted_by": "Councillor Name"
  }
}
```

---

## 5. Ward Statistics

### Get Citizens Count
```
GET /councillor/ward-stats/citizens-count
```
**Description:** Get total number of citizens in the ward

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "total_citizens": 500
  }
}
```

---

### Get Officers Count
```
GET /councillor/ward-stats/officers-count
```
**Description:** Get total number of officers/operators in the ward

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "total_officers": 12
  }
}
```

---

### Get Ward Admins Count
```
GET /councillor/ward-stats/ward-admins-count
```
**Description:** Get total number of ward administrators in the ward

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "total_ward_admins": 5
  }
}
```

---

### Get Citizens Details
```
GET /councillor/ward-stats/citizens?limit=<limit>&offset=<offset>
```
**Description:** Get detailed list of all citizens with pagination

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "citizen_id": "user_123",
      "name": "Jane Smith",
      "phone_number": "9876543210",
      "email": "jane@example.com",
      "ward": "Ward A",
      "city": "City Name",
      "state": "State Name",
      "voter_id": "voter_123"
    }
  ]
}
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

**Common Error Codes:**
- `401 Unauthorized` - Invalid or missing Bearer token
- `403 Forbidden` - User doesn't have permission (not a councillor)
- `400 Bad Request` - Missing or invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Example

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMTIzIiwicm9sZSI6ImNvdW5jaWxsb3IiLCJ3YXJkX2lkIjoid2FyZF8xMjMifQ...
```

---

## Status Values

Complaint statuses used throughout the API:
- `pending` - New complaint, awaiting approval
- `approved` - Councillor has approved the complaint
- `in_progress` - Work is currently being done
- `resolved` - Work completed, awaiting citizen confirmation
- `confirmed` - Citizen has confirmed the resolution

---

## Field Descriptions

### Complaint Fields
- **id**: Unique complaint identifier
- **title**: Brief title of the complaint
- **description**: Detailed description
- **status**: Current status (pending, approved, in_progress, resolved, confirmed)
- **category_id**: Category the complaint belongs to
- **category_name**: Human-readable category name
- **reporter_name**: Name of the citizen who filed the complaint
- **reporter_phone**: Contact number of the reporter
- **location**: Physical location of the issue
- **created_at**: When the complaint was filed (ISO 8601 format)
- **attachments**: Array of photos/videos attached
- **priority**: Issue priority level

### User Fields
- **id/user_id/citizen_id**: Unique user identifier
- **name**: User's full name
- **email**: Email address
- **phone/phone_number**: Contact phone number
- **role**: User role (councillor, councillor_admin, citizen, officer, operator)
- **ward_id**: Ward assignment
- **voter_id**: Voter identification number
- **password**: Password status (SET/NOT_SET)

---

## Implementation Notes for React Native

1. **Store JWT Token**: After login, store the token securely (using secure storage library)
2. **Add Bearer Token**: Include token in all requests' Authorization header
3. **Handle Pagination**: Use `limit` and `offset` for infinite scrolling
4. **Date Formatting**: Parse ISO 8601 dates; format for local display
5. **Error Handling**: Check `success` field; handle error responses gracefully
6. **Refresh Logic**: Implement token refresh when receiving 401 responses
7. **Offline Support**: Cache complaint data for offline viewing
8. **Real-time Updates**: Consider WebSocket for live complaint updates

---

## Quick Start Example (JavaScript/React Native)

```javascript
const API_BASE = 'http://your-server-url/api';
const TOKEN = await getStoredToken();

// Get complaints
const response = await fetch(`${API_BASE}/councillor/complaints?status=pending&limit=20`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
if (data.success) {
  console.log(data.data.complaints);
} else {
  console.error(data.message);
}
```

---

**Last Updated:** January 25, 2026
**API Version:** 1.0
