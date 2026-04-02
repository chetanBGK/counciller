Super Admin - Implemented API Endpoints

Base path: /api (server root http://localhost:3000)

Councillor Management (Super Admin):

1) Get Councillors
- GET /api/admin/councillors
  - Headers: Authorization: Bearer <token>
  - Optional Query: role, district, corporation_id/corporation, ward_id/ward
  - Response: { success, message, data: [ { id, name, phone, role, ward_id, ward, corporation_id, corporation, district, status } ] }

2) Create Councillor
- POST /api/admin/councillors
  - Body: { name, phone, ward }
  - Response (201): { success, message: 'Councillor created successfully', data: { id, name, phone, ward, status } }

3) Update Councillor
- PUT /api/admin/councillors/:id
  - Body: { name, phone, ward }
  - Response: { success, message: 'Councillor updated successfully', data: { id, name, phone, ward, status } }

4) Delete Councillor
- DELETE /api/admin/councillors/:id
  - Response: { success, message: 'Councillor deleted successfully' }

Notes:
- All endpoints require `Authorization: Bearer <token>` and `councillor_admin` role.
- Phone uniqueness and ward existence are validated server-side.
- Responses use the project's common wrapper: { success, message, data }.

This document was created from the implemented backend routes in `backend/src` on 2025-12-29. If you'd like, I can append these sections into the original `Super Admin.txt` file.
