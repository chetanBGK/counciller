# Backend API Quick Reference - Frontend Integration Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints require JWT Bearer token in headers:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1️⃣ CITIZENS ENDPOINTS

### Get Citizens List
```
GET /admin/users?role=citizen&limit=20&offset=0
```
**Response:**
```json
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
```

### Get Citizen Details
```
GET /admin/userdetails?id=<userid>
```
**Response:**
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
    "voter_id": "TN/12/456789",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "blood_group": "O+ve",
    "disability": "None",
    "language": "English",
    "aadhar_number": "7539 4665 4574"
  }
}
```

---

## 2️⃣ COMPLAINTS ENDPOINTS

### Get Complaints
```
GET /admin/complaints/my?councillorId=<id>&limit=20&offset=0
```
**Response:**
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
      "date_time": "2024-12-05T13:16:00"
    }
  ]
}
```

---

## 3️⃣ OFFICERS ENDPOINTS

### Get Officers List
```
GET /officers
```
**Response:**
```json
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
    },
    {
      "officer_id": 2,
      "name": "Amit Kumar",
      "designation": "Ward Officer",
      "department": "Ward 12",
      "phone_number": "+91 9876543211"
    }
  ]
}
```

### Get Officers by Category
```
GET /admin/categories/<categoryId>/officers
```
**Response:**
```json
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
```

---

## 4️⃣ EVENT/ANNOUNCEMENT ENDPOINTS

### Create Event/Announcement
```
POST /admin/announcement
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `event_name` (string, required) - Name of the event
- `category_id` (number, required) - Category ID
- `description` (string, required) - Event description
- `photos[]` (file[], required) - At least 1 image (max 5)
  - Supported formats: JPEG, PNG, WebP, JPG
- `videos[]` (file[], optional) - Up to 5 videos
  - Supported formats: MP4, MPEG, MOV, AVI

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/admin/announcement \
  -H "Authorization: Bearer <token>" \
  -F "event_name=Community Cleanup Drive" \
  -F "category_id=1" \
  -F "description=Join us for a community cleanup drive at Ward 15" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.png" \
  -F "videos=@/path/to/video1.mp4"
```

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully"
}
```

**Error Response (400/401):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "event_name": "Event name is required",
    "category_id": "Invalid category selected",
    "photos": "At least one image is required",
    "videos": "Event video is required"
  }
}
```

---

## 🔄 Field Mapping Reference

| Frontend Field | Backend Field | Notes |
|---|---|---|
| citizen_id | u.id | User ID |
| phone_number | u.phone | User phone |
| ward | w.name | Ward name |
| date_time | c.created_at | Complaint creation timestamp |
| designation | CASE statement | Based on user role |
| department | w.name or 'General' | Ward name or default |
| category | cat.name | Category name |

---

## ⚠️ Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 📋 Request/Response Examples

### Example: Get Citizens with Pagination
```javascript
fetch('/api/admin/users?role=citizen&limit=10&offset=0', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
```

### Example: Upload Event with Files
```javascript
const formData = new FormData();
formData.append('event_name', 'Ward Cleaning Day');
formData.append('category_id', '5');
formData.append('description', 'Cleaning drive at Ward 15');
formData.append('photos', photoFile1);
formData.append('photos', photoFile2);
formData.append('videos', videoFile);

fetch('/api/admin/announcement', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>'
    // Note: Don't set Content-Type header, browser will set it with boundary
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data))
```

---

## 🚀 Testing Tips

1. Use Postman or Thunder Client to test endpoints
2. Replace `<token>` with actual JWT token from login endpoint
3. For file uploads, use the "multipart/form-data" format in Postman
4. Check browser console for network requests when debugging

---

## 📞 Support

For API issues or questions, refer to:
- API Documentation: `/api` endpoint
- Health Check: `/health` endpoint
- Backend logs for detailed error information

---

**Last Updated:** December 2024
**Backend Version:** 1.0.0
