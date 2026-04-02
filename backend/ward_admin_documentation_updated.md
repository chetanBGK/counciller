Ward Admin - Implemented API Endpoints

This file documents the Ward Admin endpoints implemented in the backend (source: backend/src).

Base path: /api (server root http://localhost:3000)

1) Dashboard
- GET /api/admin/dashboard-stats
  - Headers: Authorization: Bearer <token>
  - Response: { success, message, data: { total_complaints, total_categories, pending_review, recent_complaints: [...] } }

2) Categories
- GET /api/admin/category
  - Returns categories with complaint counts: [{ category_id, category_name, total_complaints, phone_number }]
- POST /api/admin/category
  - Body: { category_name, phone_number }
  - Response: { success, message }
- PUT /api/admin/category/:id
  - Body: { category_name, phone_number }
  - Response: { success, message }
- DELETE /api/admin/category/:id
  - Response: { success, message }

3) Citizens (Users)
- GET /api/admin/users?role=citizen&limit=20&offset=0
  - Returns paged list of citizens: [{ citizen_id, name, phone_number, ward, email, city, state }]
- GET /api/admin/userdetails?id=<userId>
  - Returns full citizen profile including aadhar, address, disability, language

4) Complaints (Ward-specific)
- GET /api/admin/complaints/my?councillorId=<id>&status=&category=&ward=&limit=20&offset=0
  - Returns complaints assigned to the councillor with filters
- GET /api/complaints/:id
  - Complaint detail (title, description, status, date, location, citizen)
- GET /api/complaints/timeline
  - Returns status stages array
- GET /api/complaints/timeline/:id
  - Returns timeline events for complaint
- POST /api/complaints (exists) — create complaint (form-data with files)
- POST /api/complaints/:id/attachments — upload attachment
- GET /api/complaints/attachments/:id/download — presigned download URL

5) Councillor Quick Actions (via councillor routes)
- PUT /api/councillor/approve/:id — mark as seen/approved
- PUT /api/councillor/in-progress/:id — mark in-progress
- PUT /api/councillor/complete/:id — mark completed
- PUT /api/councillor/confirm/:id — (added) confirm/complete with resolution_note
- POST /api/councillor/note/:id — add internal note

6) Officers / Employees
- GET /api/officers
  - Returns list of officers/employees (id, name, phone_number, ward)
- POST /api/admin/create-admin-employee (exists) — create employee
- GET /api/admin/employees — list employees (filtered by role)

7) Announcements / Events
- POST /api/admin/announcement — multipart/form-data to create event/announcement
- GET /api/admin/announcements — list announcements

8) AI Summary
- GET /api/ai/summary/:complaintId — Generate AI summary for a complaint (uses OpenAI)
- POST /api/ai/generate-summary — (exists) general text summarization

Notes:
- All admin endpoints require `Authorization: Bearer <token>` and role validations (usually `councillor_admin`).
- Response shapes follow the success/error wrapper pattern used across the project: { success: true/false, message: string, data: ... }.

This document was created from the implemented backend routes in `backend/src` on 2025-12-29. If you want, I can merge these updates into the original `ward admin.txt` file in-place.
