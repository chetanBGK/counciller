# 🎯 **COMPLETE CITIZEN API REFERENCE**
## All Endpoints with Request & Response Details

**Base URL**: `https://councillor-app123.vercel.app/api`  
**Date**: January 28, 2026  
**API Version**: 1.0.0

---

## **📑 TABLE OF CONTENTS**
1. [Authentication (3 endpoints)](#authentication)
2. [User Profile (4 endpoints)](#user-profile)
3. [Categories (1 endpoint)](#categories)
4. [AI Features (5 endpoints)](#ai-features)
5. [Complaints (10 endpoints)](#complaints)
6. [Announcements (2 endpoints)](#announcements)
7. [Notifications (6 endpoints)](#notifications)
8. [Endpoint Summary](#endpoint-summary)
9. [Authentication Flow](#authentication-flow)
10. [Error Handling](#error-handling)
11. [Important Notes](#important-notes)

---

## **🔐 AUTHENTICATION**

### **1. Send OTP**
```http
POST /auth/send-otp
Content-Type: application/json
```

**Request:**
```json
{
  "phone": "+919876543210"
}
```

**Response (200):**
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

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid phone number format",
  "data": null
}
```

---

### **2. Verify OTP & Login**
```http
POST /auth/verify-otp
Content-Type: application/json
```

**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIrOTE5ODc2NTQzMjEwIiwicm9sZSI6ImNpdGl6ZW4iLCJpYXQiOjE3Mzc5NzYwMDB9.xyz...",
    "user": {
      "id": 1,
      "phone": "+919876543210",
      "name": "Rajesh Sharma",
      "email": "rajesh@example.com",
      "role": "citizen",
      "ward_id": 5,
      "created_at": "2024-12-06T10:00:00Z"
    }
  }
}
```

**Error (400 - Invalid OTP):**
```json
{
  "success": false,
  "message": "Invalid OTP",
  "data": null
}
```

**Error (401 - Expired OTP):**
```json
{
  "success": false,
  "message": "OTP expired. Please request a new one",
  "data": null
}
```

---

### **3. Test Token**
```http
GET /auth/test
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": 1,
    "phone": "+919876543210",
    "role": "citizen",
    "ward_id": 5
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

---

## **👤 USER PROFILE**

### **4. Get User Profile**
```http
GET /user/me
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "phone": "+919876543210",
    "name": "Rajesh Sharma",
    "full_name": "Rajesh Kumar Sharma",
    "email": "rajesh@example.com",
    "gender": "male",
    "dob": "1990-05-15",
    "language": "en",
    "profile_photo": "https://res.cloudinary.com/xyz/image/upload/v1234/profile_photos/user_1.jpg",
    "voter_id": "ABC1234567",
    "disability": "None",
    "aadhar_number": "7539 4665 4574",
    "blood_group": "O+ve",
    "municipal_corporation": "Kalyan-Dombivli Municipal Corporation",
    "ward_id": 5,
    "ward_name": "Ward 5 - Dombivli East",
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "house_number": "123",
    "area": "Downtown",
    "landmark": "Near City Hall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "geo_hash": "tdr123",
    "role": "citizen",
    "is_active": true,
    "created_at": "2024-12-06T10:00:00Z",
    "updated_at": "2026-01-20T15:30:00Z",
    "last_location_update": "2026-01-20T15:30:00Z"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

---

### **5. Update User Profile (All Fields)**
```http
PUT /user/update
Authorization: Bearer <token>
Content-Type: application/json
```

**Request (ALL fields are optional - send only what you want to update):**
```json
{
  "name": "Rajesh Kumar Sharma",
  "full_name": "Rajesh Kumar Sharma",
  "email": "rajesh.new@example.com",
  "phone": "+919876543210",
  "gender": "male",
  "dob": "1990-05-15",
  "language": "hi",
  "profile_photo": "https://...",
  "voter_id": "ABC1234567",
  "disability": "None",
  "aadhar_number": "7539 4665 4574",
  "blood_group": "A+ve",
  "ward_id": 5,
  "municipal_corporation": "Kalyan-Dombivli MC",
  "address_line1": "456 Oak Avenue",
  "address_line2": "Apt 5C",
  "house_number": "456",
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

**Note:** `profile_photo` can also be base64 encoded:
```json
{
  "profile_photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "phone": "+919876543210",
    "name": "Rajesh Kumar Sharma",
    "email": "rajesh.new@example.com",
    "gender": "male",
    "dob": "1990-05-15",
    "language": "hi",
    "profile_photo": "https://res.cloudinary.com/...",
    "blood_group": "A+ve",
    "address_line1": "456 Oak Avenue",
    "city": "Mumbai",
    "latitude": 19.0880,
    "longitude": 72.8680,
    "updated_at": "2026-01-28T12:30:00Z",
    "last_location_update": "2026-01-28T12:30:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid email format",
  "data": null
}
```

---

### **6. Update User Location (Alternative)**
```http
PUT /user/location
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "address_line1": "789 New Street",
  "address_line2": "Building A",
  "house_number": "789",
  "area": "Uptown",
  "landmark": "Near Metro Station",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400003",
  "latitude": 19.0950,
  "longitude": 72.8750,
  "geo_hash": "tdr5v8"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "address_line1": "789 New Street",
    "address_line2": "Building A",
    "house_number": "789",
    "area": "Uptown",
    "landmark": "Near Metro Station",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400003",
    "latitude": 19.0950,
    "longitude": 72.8750,
    "geo_hash": "tdr5v8",
    "last_location_update": "2026-01-28T12:35:00Z"
  }
}
```

---

### **7. Search Users**
```http
GET /user/search?q=rajesh
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (required) - Search term (min 2 characters)

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Search completed",
  "data": [
    {
      "id": 1,
      "name": "Rajesh Sharma",
      "phone": "+919876543210",
      "email": "rajesh@example.com",
      "role": "citizen",
      "ward_id": 5
    },
    {
      "id": 12,
      "name": "Rajesh Kumar",
      "phone": "+919876543299",
      "email": "rajesh.kumar@example.com",
      "role": "citizen",
      "ward_id": 3
    }
  ]
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Search query is required",
  "data": null
}
```

---

## **📋 CATEGORIES**

### **8. Get Categories**
```http
GET /user/categories
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "category_id": 1,
      "category_name": "Roads & Potholes",
      "phone_number": "+919876543211"
    },
    {
      "category_id": 2,
      "category_name": "Street Lights",
      "phone_number": "+919876543212"
    },
    {
      "category_id": 3,
      "category_name": "Water Supply",
      "phone_number": "+919876543213"
    },
    {
      "category_id": 4,
      "category_name": "Sewerage",
      "phone_number": "+919876543214"
    },
    {
      "category_id": 5,
      "category_name": "Garbage Collection",
      "phone_number": "+919876543215"
    }
  ]
}
```

---

## **🤖 AI FEATURES**

### **26. AI Chat - Conversational Complaint Registration**
```http
POST /ai/chat
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Description:** Have a natural conversation with AI to register complaints. The AI will ask follow-up questions to gather all necessary details (title, description, location, category, priority) before creating the complaint.

**Request (Form Data):**
```
session_id: "uuid-v4-string" (optional - for continuing existing conversation)
message: "There is a huge pothole on Main Street causing accidents" (optional - text description)
latitude: 19.0760 (optional - location coordinate)
longitude: 72.8777 (optional - location coordinate)
images: [image1.jpg, image2.jpg] (optional - max 5 images)
videos: [video1.mp4] (optional - max 2 videos)
```

**Response (200 - Greeting):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "greeting",
  "message": "Hello Rajesh! I'm here to help you register a complaint. What issue would you like to report?",
  "extracted_so_far": {}
}
```

**Response (200 - Follow-up Question):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "question",
  "message": "Thank you for reporting the pothole issue. Can you provide more details about the exact location? For example, which street or landmark is it near?",
  "extracted_so_far": {
    "category": "Roads & Potholes",
    "priority": "high",
    "description": "There is a huge pothole on Main Street causing accidents"
  }
}
```

**Response (200 - Complaint Created):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "complaint_created",
  "message": "Perfect! I've registered your complaint about the pothole on Main Street. Your complaint ID is #45. The ward office has been notified and you'll receive updates on your complaint status.",
  "complaint": {
    "id": 45,
    "title": "Pothole on Main Street causing accidents",
    "category": "Roads & Potholes",
    "priority": "high",
    "ward_id": 5,
    "councillor_id": 10,
    "status": "submitted"
  }
}
```

**Response (400 - Ward Validation Error):**
```json
{
  "error": "This location is in Ward 3 (Ward 3 - Kalyan West), but you belong to Ward 5 (Ward 5 - Dombivli East). You can only register complaints in your own ward.",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "citizen_ward": {
    "id": 5,
    "name": "Ward 5 - Dombivli East",
    "number": 5
  },
  "location_ward": {
    "id": 3,
    "name": "Ward 3 - Kalyan West",
    "number": 3
  }
}
```

**Usage Flow:**
```javascript
// Step 1: Start conversation
const response1 = await api.post('/ai/chat', {
  message: "There is a pothole on Main Street"
});
// Save session_id: response1.session_id

// Step 2: Continue conversation with same session_id
const response2 = await api.post('/ai/chat', {
  session_id: response1.session_id,
  message: "It's near the City Hall",
  latitude: 19.0760,
  longitude: 72.8777
});

// Step 3: AI might ask more questions or create complaint
if (response2.type === 'complaint_created') {
  console.log('Complaint created:', response2.complaint);
}
```

**Features:**
- Multi-turn conversation
- Automatic information extraction
- Ward validation
- Category and priority detection
- Support for text, images, and videos
- Session management
- Natural language understanding

---

### **27. AI Create Complaint (Direct)**
```http
POST /ai/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Description:** Create a complaint using AI analysis without conversation. AI will analyze text and/or images to extract title, description, category, and priority.

**Request (Form Data):**
```
title: "Pothole on Main Street" (optional - will be generated if not provided)
description: "Large pothole causing accidents" (optional - will be generated from image if not provided)
lat: 19.0760 (required - location latitude)
lng: 72.8777 (required - location longitude)
category_id: 1 (optional - AI will detect if not provided)
images: [image1.jpg] (optional - AI can analyze images to understand the issue)
videos: [video1.mp4] (optional)
```

**Scenarios:**
1. **Text only**: Provide title/description + location
2. **Image only**: Provide image + location (AI will generate title/description)
3. **Text + Image**: Provide both (AI will enhance description)

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint created via AI",
  "data": {
    "id": 46,
    "user_id": 1,
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic congestion and safety hazards. The pothole is approximately 2 feet wide and 6 inches deep.",
    "status": "submitted",
    "priority": "high",
    "category_id": 1,
    "category_name": "Roads & Potholes",
    "ward_id": 5,
    "councillor_id": 10,
    "latitude": 19.0760,
    "longitude": 72.8777,
    "metadata": {
      "ai": {
        "title": "Pothole on Main Street",
        "description": "Large pothole causing traffic congestion and safety hazards",
        "category": "Roads & Potholes",
        "priority": "high",
        "confidence": 0.92
      }
    },
    "created_at": "2026-01-28T14:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "At least provide text or image",
  "data": null
}
```

---

### **28. AI Process Complaint**
```http
POST /ai/process
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Analyze complaint text to extract structured information (category, priority, entities).

**Request:**
```json
{
  "title": "Street light not working",
  "description": "The street light at Oak Avenue near the park has not been working for 3 days. This area is very dark at night and it's dangerous for pedestrians."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint processed by AI",
  "data": {
    "title": "Street light not working at Oak Avenue",
    "description": "The street light at Oak Avenue near the park has not been working for 3 days. This area is very dark at night and it's dangerous for pedestrians.",
    "category": "Street Lights",
    "priority": "high",
    "location": {
      "street": "Oak Avenue",
      "landmark": "near the park"
    },
    "entities": [
      {
        "type": "duration",
        "value": "3 days"
      },
      {
        "type": "location",
        "value": "Oak Avenue"
      },
      {
        "type": "landmark",
        "value": "park"
      }
    ],
    "confidence": 0.89
  }
}
```

---

### **29. AI Extract Addresses**
```http
POST /ai/extract-addresses
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Extract location entities from text.

**Request:**
```json
{
  "text": "There is garbage accumulation near the railway station on Station Road, close to the post office"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Entities extracted",
  "data": {
    "locations": [
      {
        "type": "landmark",
        "value": "railway station"
      },
      {
        "type": "street",
        "value": "Station Road"
      },
      {
        "type": "landmark",
        "value": "post office"
      }
    ],
    "full_address": "Station Road, near railway station and post office"
  }
}
```

---

### **30. AI Generate Summary**
```http
POST /ai/generate-summary
Authorization: Bearer <token>
Content-Type: application/json
```

**Description:** Generate a concise summary of long text.

**Request:**
```json
{
  "text": "I have been facing severe water supply issues in my area for the past two weeks. The water comes only once a day for about 30 minutes in the morning around 6 AM. This is causing a lot of problems as we have to store water for the entire day. Many times the pressure is so low that water doesn't reach the upper floors. Residents are having to buy water from private tankers which is very expensive. We have raised this issue multiple times but no action has been taken. The entire street is facing this problem and it needs urgent attention from the water department.",
  "max_length": 100
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Summary generated",
  "data": {
    "summary": "Severe water supply issues for two weeks. Water available only once daily for 30 minutes with low pressure. Residents buying expensive private tanker water. Urgent attention needed from water department."
  }
}
```

---

## **📢 COMPLAINTS**

### **9. Create Complaint**
```http
POST /complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (Form Data):**
```
title: "Pothole on Main Street" (required)
description: "Large pothole causing traffic congestion and accidents. Urgent repair needed." (required)
category_id: 1 (optional)
ward_id: 5 (optional - auto-set from user's ward)
priority: "high" (optional: low/medium/high, default: medium)
severity: "medium" (optional: low/medium/high)
address_line1: "123 Main Street" (optional)
address_line2: "Near Signal" (optional)
area: "Downtown" (optional)
landmark: "Near City Hall" (optional)
city: "Mumbai" (optional)
state: "Maharashtra" (optional)
pincode: "400001" (optional)
latitude: 19.0760 (optional)
longitude: 72.8777 (optional)
metadata: {} (optional - JSON object)
files: [file1.jpg, file2.jpg] (optional - max 5 files, 10MB each)
images: [image1.jpg] (optional - max 5 images, 10MB each)
```

**Supported File Types:** JPEG, PNG, WebP, PDF  
**Max File Size:** 10MB per file  
**Max Files:** 5 total (files + images combined)

**Response (201):**
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic congestion and accidents. Urgent repair needed.",
    "status": "submitted",
    "priority": "high",
    "severity": "medium",
    "category_id": 1,
    "category_name": "Roads & Potholes",
    "ward_id": 5,
    "ward_name": "Ward 5",
    "reporter_id": 1,
    "reporter_name": "Rajesh Sharma",
    "address_line1": "123 Main Street",
    "city": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "attachments": [
      {
        "id": 1,
        "filename": "pothole_photo1.jpg",
        "file_type": "image/jpeg",
        "file_size": 2048576
      }
    ],
    "created_at": "2026-01-28T12:40:00Z",
    "updated_at": "2026-01-28T12:40:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "title and description required",
  "data": null
}
```

**Error (413):**
```json
{
  "success": false,
  "message": "File size exceeds 10MB limit",
  "data": null
}
```

---

### **10. Get My Complaints**
```http
GET /complaints/my?limit=20&offset=0&status=in_progress
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20) - Number of records
- `offset` (optional, default: 0) - Skip records for pagination
- `status` (optional) - Filter by: submitted/seen/in_progress/resolved/closed

**Request:** No body required

**Response (200):**
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
      "severity": "medium",
      "category_id": 1,
      "category_name": "Roads & Potholes",
      "ward_id": 5,
      "ward_name": "Ward 5",
      "reporter_id": 1,
      "address_line1": "123 Main Street",
      "city": "Mumbai",
      "created_at": "2026-01-20T15:40:00Z",
      "updated_at": "2026-01-21T16:00:00Z"
    },
    {
      "id": 43,
      "title": "Broken street light",
      "description": "Street light not working on Oak Avenue",
      "status": "submitted",
      "priority": "medium",
      "category_id": 2,
      "category_name": "Street Lights",
      "ward_id": 5,
      "created_at": "2026-01-19T10:15:00Z",
      "updated_at": "2026-01-19T10:15:00Z"
    }
  ]
}
```

---

### **11. Get All Complaints (with Filters)**
```http
GET /complaints?limit=20&offset=0&status=submitted&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)
- `status` (optional) - submitted/seen/in_progress/resolved/closed
- `priority` (optional) - low/medium/high
- `category_id` (optional) - Filter by category
- `ward_id` (optional) - Filter by ward

**Request:** No body required

**Response (200):** Same as "Get My Complaints"

---

### **12. Get Complaint Details**
```http
GET /complaints/42
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint details retrieved",
  "data": {
    "id": 42,
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic congestion and accidents. Urgent repair needed.",
    "status": "in_progress",
    "priority": "high",
    "severity": "medium",
    "category_id": 1,
    "category_name": "Roads & Potholes",
    "ward_id": 5,
    "ward_name": "Ward 5 - Dombivli East",
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
    "assigned_officer_id": 15,
    "assigned_officer_name": "Officer Kumar",
    "location": {
      "address_line1": "123 Main Street",
      "address_line2": "Near Signal",
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
        "uploaded_at": "2026-01-20T15:40:00Z"
      },
      {
        "id": 2,
        "filename": "damage_report.pdf",
        "file_type": "application/pdf",
        "file_size": 1048576,
        "storage_key": "complaints/42/1703086820000_damage_report.pdf",
        "uploaded_by": 1,
        "uploaded_at": "2026-01-20T15:41:00Z"
      }
    ],
    "timeline": [
      {
        "status": "SUBMITTED",
        "date": "2026-01-20T15:40:00Z",
        "label": "Complaint Submitted",
        "actor": "Rajesh Sharma",
        "note": "Complaint submitted by citizen"
      },
      {
        "status": "SEEN",
        "date": "2026-01-20T16:00:00Z",
        "label": "Seen by Ward Admin",
        "actor": "Jane Smith",
        "note": "Complaint viewed"
      },
      {
        "status": "IN_PROGRESS",
        "date": "2026-01-21T16:30:00Z",
        "label": "Work Started",
        "actor": "Jane Smith",
        "note": "Assigned to contractor ABC Ltd for repair"
      }
    ],
    "metadata": {},
    "created_at": "2026-01-20T15:40:00Z",
    "updated_at": "2026-01-21T16:30:00Z",
    "resolved_at": null
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Complaint not found",
  "data": null
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "You do not have access to this complaint",
  "data": null
}
```

---

### **13. Get Complaint Timeline**
```http
GET /complaints/timeline/42
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint timeline retrieved",
  "data": [
    {
      "id": 1,
      "complaint_id": 42,
      "status": "SUBMITTED",
      "date": "2026-01-20T15:40:00Z",
      "label": "Complaint Submitted",
      "actor_id": 1,
      "actor_name": "Rajesh Sharma",
      "note": "Complaint submitted by citizen",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 2,
      "complaint_id": 42,
      "status": "SEEN",
      "date": "2026-01-20T16:00:00Z",
      "label": "Seen by Ward Admin",
      "actor_id": 10,
      "actor_name": "Jane Smith",
      "note": "Complaint viewed by ward administrator",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 3,
      "complaint_id": 42,
      "status": "IN_PROGRESS",
      "date": "2026-01-21T16:30:00Z",
      "label": "Work Started",
      "actor_id": 10,
      "actor_name": "Jane Smith",
      "note": "Assigned to contractor ABC Ltd for repair. Work expected to complete in 3 days.",
      "event_type": "STATUS_CHANGE"
    },
    {
      "id": 4,
      "complaint_id": 42,
      "status": "RESOLVED",
      "date": "2026-01-24T14:00:00Z",
      "label": "Resolved",
      "actor_id": 10,
      "actor_name": "Jane Smith",
      "note": "Pothole has been filled. Road is now safe for traffic.",
      "event_type": "STATUS_CHANGE"
    }
  ]
}
```

---

### **14. Get Timeline Stages**
```http
GET /complaints/timeline
Authorization: Bearer <token>
```

**Request:** No body required

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

### **15. Change Complaint Status**
```http
POST /complaints/42/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "CITIZEN_CONFIRMED",
  "note": "I can confirm the issue has been resolved. Thank you!"
}
```

**Valid Status Values for Citizens:**
- `CITIZEN_CONFIRMED` - Confirm issue is resolved
- `CLOSED` - Close the complaint

**Response (200):**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": 42,
    "status": "CITIZEN_CONFIRMED",
    "updated_at": "2026-01-28T10:00:00Z",
    "note": "I can confirm the issue has been resolved. Thank you!"
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "You cannot change status to this value",
  "data": null
}
```

---

### **16. Upload Complaint Attachment**
```http
POST /complaints/42/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (Form Data):**
```
file: <image or pdf file> (max 10MB, types: JPEG, PNG, WebP, PDF)
```

**Response (200):**
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
    "uploaded_at": "2026-01-28T10:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Unsupported file type",
  "data": null
}
```

---

### **17. Download Complaint Attachment**
```http
GET /complaints/attachments/1/download
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Download URL generated",
  "data": {
    "download_url": "https://s3.amazonaws.com/bucket/complaints/42/pothole_photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
    "filename": "pothole_photo.jpg",
    "file_type": "image/jpeg",
    "file_size": 2048576,
    "expires_in": 3600
  }
}
```

**Note:** The `download_url` is a presigned URL valid for 1 hour (3600 seconds)

**Error (404):**
```json
{
  "success": false,
  "message": "Attachment not found",
  "data": null
}
```

---

## **📰 ANNOUNCEMENTS**

### **18. Get Announcements**
```http
GET /user/announcements?limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Scheduled Water Supply Maintenance",
      "description": "Water supply will be shut down on January 25, 2026 from 8 AM to 4 PM for scheduled maintenance. Citizens are requested to store water accordingly. Normal supply will resume by 6 PM.",
      "image_url": "https://res.cloudinary.com/xyz/announcements/water_maintenance.jpg",
      "category": "Water Supply",
      "media_url": null,
      "created_by": 10,
      "created_by_name": "Jane Smith",
      "created_by_phone": "+919876543220",
      "target_ward": 5,
      "priority": "high",
      "status": "active",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    },
    {
      "id": 2,
      "title": "Road Repair Work on Oak Avenue",
      "description": "Repair work will commence on Oak Avenue starting January 28. Please avoid the area during peak hours (8 AM - 10 AM, 6 PM - 8 PM). Estimated completion: 2 weeks.",
      "image_url": "https://res.cloudinary.com/xyz/announcements/road_repair.jpg",
      "category": "Roads",
      "created_by_name": "Jane Smith",
      "target_ward": 5,
      "priority": "medium",
      "created_at": "2026-01-18T14:30:00Z"
    },
    {
      "id": 3,
      "title": "Garbage Collection Schedule Change",
      "description": "Due to public holiday, garbage collection will be done on Saturday this week instead of Friday.",
      "image_url": null,
      "category": "Sanitation",
      "priority": "low",
      "created_at": "2026-01-15T08:00:00Z"
    }
  ]
}
```

---

### **19. Get Announcement Details**
```http
GET /user/announcements/1
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Scheduled Water Supply Maintenance",
    "description": "Water supply will be shut down on January 25, 2026 from 8 AM to 4 PM for scheduled maintenance. Citizens are requested to store water accordingly. Normal supply will resume by 6 PM. In case of emergency, contact the water department at +919876543213.",
    "image_url": "https://res.cloudinary.com/xyz/announcements/water_maintenance.jpg",
    "category": "Water Supply",
    "media_url": null,
    "created_by": 10,
    "created_by_name": "Jane Smith",
    "created_by_phone": "+919876543220",
    "target_ward": 5,
    "target_ward_name": "Ward 5 - Dombivli East",
    "priority": "high",
    "status": "active",
    "view_count": 245,
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Announcement not found",
  "data": null
}
```

---

## **🔔 NOTIFICATIONS**

### **20. Get Notifications**
```http
GET /notifications?limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Notifications retrieved",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "complaint_status_update",
      "title": "Complaint Status Updated",
      "message": "Your complaint 'Pothole on Main Street' status changed to In Progress",
      "complaint_id": 42,
      "announcement_id": null,
      "read": false,
      "metadata": {
        "old_status": "SEEN",
        "new_status": "IN_PROGRESS"
      },
      "created_at": "2026-01-21T16:30:00Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "type": "complaint_resolved",
      "title": "Complaint Resolved",
      "message": "Your complaint 'Broken street light' has been resolved. Please confirm if the issue is fixed.",
      "complaint_id": 43,
      "read": false,
      "created_at": "2026-01-24T14:30:00Z"
    },
    {
      "id": 3,
      "user_id": 1,
      "type": "announcement",
      "title": "New Announcement",
      "message": "Scheduled Water Supply Maintenance on January 25",
      "announcement_id": 1,
      "complaint_id": null,
      "read": true,
      "created_at": "2026-01-20T09:00:00Z"
    },
    {
      "id": 4,
      "user_id": 1,
      "type": "comment",
      "title": "New Comment on Complaint",
      "message": "Ward admin added a comment on your complaint",
      "complaint_id": 42,
      "read": true,
      "created_at": "2026-01-20T17:00:00Z"
    }
  ]
}
```

**Notification Types:**
- `complaint_status_update` - Status changed
- `complaint_resolved` - Complaint marked as resolved
- `complaint_assigned` - Complaint assigned to officer
- `announcement` - New announcement published
- `comment` - New comment on complaint

---

### **21. Get User Notifications (Alternative)**
```http
GET /user/notifications
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):** Same as GET /notifications

---

### **22. Mark Notification as Read**
```http
PUT /notifications/read/1
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 1,
    "read": true,
    "updated_at": "2026-01-28T12:00:00Z"
  }
}
```

---

### **23. Mark All Notifications as Read**
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "marked_as_read": 15,
    "updated_at": "2026-01-28T12:00:00Z"
  }
}
```

---

### **24. Get Unread Notification Count**
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
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

### **25. Delete Notification**
```http
DELETE /notifications/1
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

---

## **📊 ENDPOINT SUMMARY**

| Category | Count | Endpoints |
|----------|-------|-----------|
| **Authentication** | 3 | Send OTP, Verify OTP, Test Token |
| **User Profile** | 4 | Get Profile, Update Profile, Update Location, Search Users |
| **Categories** | 1 | Get Categories |
| **AI Features** | 5 | AI Chat, AI Create Complaint, AI Process, Extract Addresses, Generate Summary |
| **Complaints** | 10 | Create, Get My, Get All, Get Details, Timeline, Stages, Status Change, Upload, Download, Search |
| **Announcements** | 2 | Get List, Get Details |
| **Notifications** | 6 | Get, Get User Notifications, Mark Read, Mark All Read, Unread Count, Delete |
| **TOTAL** | **31** | All Citizen-facing Endpoints |

---

## **🔐 AUTHENTICATION FLOW**

### **Step-by-Step Login Process**

1. **Send OTP Request**
   ```javascript
   POST /auth/send-otp
   Body: { "phone": "+919876543210" }
   ```

2. **User Receives OTP via SMS**
   - OTP is valid for 5 minutes (300 seconds)
   - Store the phone number for verification step

3. **Verify OTP**
   ```javascript
   POST /auth/verify-otp
   Body: { "phone": "+919876543210", "otp": "123456" }
   ```

4. **Store JWT Token**
   ```javascript
   // Response contains token
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { ... }
   }
   
   // Store in AsyncStorage or SecureStore
   await AsyncStorage.setItem('authToken', response.data.token);
   await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
   ```

5. **Use Token for All API Calls**
   ```javascript
   // Add to headers for all authenticated requests
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

6. **Token Expiration**
   - Token valid for 24 hours
   - On 401 error, re-authenticate user
   - Implement auto-refresh or re-login flow

---

## **🔒 AUTHENTICATION HEADERS**

All endpoints (except Send OTP and Verify OTP) require:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **React Native Example:**

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://councillor-app123.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored data and redirect to login
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## **❌ ERROR HANDLING**

### **HTTP Status Codes**

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

### **Common Error Responses**

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Forbidden - You don't have permission",
  "data": null
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found",
  "data": null
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid input data",
  "data": null
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null
}
```

### **Error Handling in React Native:**

```javascript
try {
  const response = await api.get('/user/me');
  console.log('User:', response.data.data);
} catch (error) {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        Alert.alert('Invalid Request', data.message);
        break;
      case 401:
        Alert.alert('Session Expired', 'Please login again');
        // Navigate to login
        break;
      case 403:
        Alert.alert('Access Denied', data.message);
        break;
      case 404:
        Alert.alert('Not Found', data.message);
        break;
      case 500:
        Alert.alert('Server Error', 'Please try again later');
        break;
      default:
        Alert.alert('Error', data.message || 'Something went wrong');
    }
  } else if (error.request) {
    // Network error
    Alert.alert('Network Error', 'Please check your internet connection');
  } else {
    // Other error
    Alert.alert('Error', error.message);
  }
}
```

---

## **📌 IMPORTANT NOTES**

### **General**
✅ **Token expires in 24 hours** - Re-login when expired  
✅ **All timestamps in UTC** - ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)  
✅ **Phone format**: E.164 format (+919876543210)  
✅ **Pagination**: Use `limit` and `offset` parameters  

### **AI Features**
✅ **AI Chat Sessions**: Each conversation has a unique `session_id` - save it to continue the conversation  
✅ **Ward Validation**: AI chat validates that complaint location is within your ward  
✅ **Automatic Category Detection**: AI can identify complaint category from text/images  
✅ **Priority Assessment**: AI determines complaint priority (low/medium/high) based on description  
✅ **Image Analysis**: AI can analyze images to generate title and description automatically  
✅ **Multi-turn Conversations**: AI asks follow-up questions to gather complete information  
✅ **Session Expiry**: Chat sessions expire after 30 minutes of inactivity  
✅ **OpenAI Required**: AI features require OpenAI API key configuration on server  

### **File Uploads**
✅ **File uploads max 10MB** - Per file limit  
✅ **Max 5 files per complaint** - Total attachment limit  
✅ **Supported file types**: JPEG, PNG, WebP, PDF  
✅ **Base64 images**: Supported in profile_photo field  
✅ **Multipart form-data**: Required for file uploads  

### **Complaint Status Flow**
```
SUBMITTED → SEEN → IN_PROGRESS → RESOLVED → CITIZEN_CONFIRMED → CLOSED
                                         ↘ REJECTED
```

Citizens can only change status to:
- `CITIZEN_CONFIRMED` - When issue is resolved
- `CLOSED` - To close the complaint

### **Data Types**

| Type | Format | Example |
|------|--------|---------|
| String | UTF-8 text | "Hello World" |
| Integer | Whole number | 42 |
| Number | Decimal | 19.0760 |
| Boolean | true/false | true |
| DateTime | ISO 8601 UTC | "2026-01-28T12:00:00Z" |
| Array | JSON array | [1, 2, 3] |
| Object | JSON object | {"key": "value"} |

### **Rate Limiting**
- No rate limiting currently implemented
- Recommended limits for production:
  - OTP requests: 5 per minute per phone
  - API requests: 100 per minute per user
  - File uploads: 10 per minute per user

---

## **🚀 REACT NATIVE INTEGRATION EXAMPLES**

### **1. Authentication (Login)**

```javascript
import api from './api'; // Your axios instance

// Send OTP
export const sendOTP = async (phone) => {
  try {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    const { token, user } = response.data.data;
    
    // Store token and user data
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    throw error;
  }
};
```

### **2. Get User Profile**

```javascript
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/me');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### **3. Update Profile**

```javascript
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/user/update', profileData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### **4. AI Chat - Conversational Complaint Registration**

```javascript
// Initialize AI chat session
export const startAIChat = async (initialMessage, location) => {
  try {
    const formData = new FormData();
    formData.append('message', initialMessage);
    
    if (location) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }
    
    const response = await api.post('/ai/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return {
      sessionId: response.data.session_id,
      type: response.data.type,
      message: response.data.message,
      extractedData: response.data.extracted_so_far,
      complaint: response.data.complaint // Only if type === 'complaint_created'
    };
  } catch (error) {
    throw error;
  }
};

// Continue AI chat conversation
export const continueAIChat = async (sessionId, message, location, images) => {
  try {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    
    if (message) {
      formData.append('message', message);
    }
    
    if (location) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }
    
    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${index}.jpg`
        });
      });
    }
    
    const response = await api.post('/ai/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return {
      type: response.data.type,
      message: response.data.message,
      extractedData: response.data.extracted_so_far,
      complaint: response.data.complaint
    };
  } catch (error) {
    throw error;
  }
};

// Example usage in component
const ChatComplaintScreen = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const sendMessage = async (userMessage) => {
    // Add user message to UI
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

    try {
      let response;
      
      if (!sessionId) {
        // Start new chat
        response = await startAIChat(userMessage, currentLocation);
        setSessionId(response.sessionId);
      } else {
        // Continue existing chat
        response = await continueAIChat(sessionId, userMessage, currentLocation);
      }

      // Add AI response to UI
      setMessages(prev => [...prev, { type: 'assistant', text: response.message }]);

      if (response.type === 'complaint_created') {
        // Complaint successfully created
        Alert.alert('Success', 'Your complaint has been registered!');
        navigation.navigate('ComplaintDetails', { id: response.complaint.id });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <ScrollView>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} type={msg.type} text={msg.text} />
        ))}
      </ScrollView>
      <TextInput onSubmitEditing={(e) => sendMessage(e.nativeEvent.text)} />
    </View>
  );
};
```

### **5. AI Create Complaint (Direct - No Conversation)**

```javascript
export const createComplaintWithAI = async (data, images) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('lat', data.latitude);
    formData.append('lng', data.longitude);
    
    // Add images (AI will analyze them)
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${index}.jpg`
        });
      });
    }
    
    const response = await api.post('/ai/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Example: Image-only complaint
const createImageComplaint = async (imageUri, location) => {
  const complaint = await createComplaintWithAI(
    { 
      latitude: location.latitude, 
      longitude: location.longitude 
    },
    [{ uri: imageUri, type: 'image/jpeg' }]
  );
  
  console.log('AI generated:', complaint.metadata.ai);
  // AI will generate title, description, category, priority from image
};
```

### **6. Create Complaint with Images**

```javascript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const createComplaint = async (complaintData, images) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('category_id', complaintData.category_id);
    formData.append('priority', complaintData.priority);
    formData.append('latitude', complaintData.latitude);
    formData.append('longitude', complaintData.longitude);
    
    // Add images
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `photo_${index}.jpg`,
        });
      });
    }
    
    const response = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### **7. Get My Complaints**

```javascript
export const getMyComplaints = async (status = null, limit = 20, offset = 0) => {
  try {
    let url = `/complaints/my?limit=${limit}&offset=${offset}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### **8. Get Complaint Details**

```javascript
export const getComplaintDetails = async (complaintId) => {
  try {
    const response = await api.get(`/complaints/${complaintId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### **9. Get Notifications**

```javascript
export const getNotifications = async (limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/notifications?limit=${limit}&offset=${offset}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/read/${notificationId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.unread_count;
  } catch (error) {
    throw error;
  }
};
```

### **10. Get Announcements**

```javascript
export const getAnnouncements = async (limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/user/announcements?limit=${limit}&offset=${offset}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

---

## **🔧 TESTING WITH POSTMAN**

### **Import Base URL**
1. Create new environment in Postman
2. Add variable: `base_url` = `https://councillor-app123.vercel.app/api`
3. Add variable: `token` (will be filled after login)

### **Test Flow**
1. **Send OTP**: POST `{{base_url}}/auth/send-otp`
2. **Verify OTP**: POST `{{base_url}}/auth/verify-otp` → Copy token
3. **Set Token**: Add to environment variable
4. **Get Profile**: GET `{{base_url}}/user/me`
5. **Create Complaint**: POST `{{base_url}}/complaints`
6. **Get Complaints**: GET `{{base_url}}/complaints/my`

---

## **📱 RECOMMENDED REACT NATIVE PACKAGES**

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-image-picker": "^7.0.0",
    "react-native-maps": "^1.10.0",
    "react-native-geolocation-service": "^5.3.0",
    "@react-navigation/native": "^6.1.0",
    "expo-image-picker": "^14.7.0",
    "expo-file-system": "^16.0.0"
  }
}
```

---

## **💡 BEST PRACTICES**

### **Security**
✅ Store JWT token securely (use `expo-secure-store` or `@react-native-async-storage/async-storage`)  
✅ Never log sensitive data (tokens, OTP, passwords)  
✅ Clear token on logout  
✅ Handle 401 errors globally for token expiration  

### **Performance**
✅ Implement pagination for long lists  
✅ Cache API responses when appropriate  
✅ Compress images before upload  
✅ Use FlatList for complaint/notification lists  

### **User Experience**
✅ Show loading indicators during API calls  
✅ Display error messages clearly  
✅ Implement pull-to-refresh  
✅ Handle offline scenarios  
✅ Show success feedback after actions  

### **File Uploads**
✅ Validate file size before upload  
✅ Show upload progress  
✅ Compress images using `expo-image-manipulator`  
✅ Limit number of files (max 5)  

---

## **🆘 TROUBLESHOOTING**

### **Common Issues**

**Q: Getting "Invalid OTP" error**
- Ensure OTP is entered correctly (6 digits)
- Check OTP expiration (valid for 5 minutes)
- Try requesting new OTP

**Q: Token expired error**
- Re-login to get new token
- Implement automatic re-authentication

**Q: File upload fails**
- Check file size (max 10MB)
- Verify file type (JPEG, PNG, WebP, PDF)
- Ensure correct Content-Type header

**Q: Network request failed**
- Check internet connection
- Verify base URL is correct
- Check if server is running

**Q: 403 Forbidden error**
- Verify user has correct permissions
- Check if token is valid
- Ensure user is authenticated

---

## **📞 SUPPORT**

For issues or questions:
- **Backend Team**: backend@example.com
- **Documentation**: Check GitHub repository
- **API Status**: https://status.example.com

---

**Last Updated**: January 28, 2026  
**API Version**: 1.0.0  
**Document Version**: 1.0  
**Maintained By**: Ward Complaint Management System Development Team

---

**Ready for React Native Development! 🚀**
