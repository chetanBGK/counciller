# Push Notification API (FCM)

This document covers the new/updated endpoints and payloads for React Native integration.

## Base
- Base URL: /api
- Auth: Bearer token in Authorization header

---

## 1) Register Device Token
Register the FCM device token for the logged-in user and subscribe to role + ward topics.

- Method: POST
- Path: /api/notifications/device-token
- Auth: Required

Request body (JSON)
{
  "token": "<fcm_device_token>",
  "device_type": "android" | "ios",
  "device_model": "<device model>",
  "app_version": "<app version>"
}

Success response (example)
{
  "success": true,
  "message": "Device token registered",
  "data": {
    "id": 1,
    "user_id": 123,
    "token": "<fcm_device_token>",
    "role": "citizen",
    "device_type": "android",
    "device_model": "Pixel 7",
    "app_version": "1.4.2",
    "last_seen": "2026-02-07T12:00:00.000Z",
    "created_at": "2026-02-07T12:00:00.000Z"
  }
}

Notes
- Call this after login and whenever the token changes (FCM can rotate tokens).
- The backend subscribes the token to topics:
  - role_<role>
  - ward_<ward_id> (if ward_id exists for the user)

---

## 2) Unregister Device Token
Remove the FCM token on logout or when the device opts out.

- Method: DELETE
- Path: /api/notifications/device-token
- Auth: Required

Request body (JSON)
{
  "token": "<fcm_device_token>"
}

Success response (example)
{
  "success": true,
  "message": "Device token unregistered",
  "data": {
    "id": 1,
    "user_id": 123,
    "token": "<fcm_device_token>",
    "role": "citizen",
    "device_type": "android",
    "device_model": "Pixel 7",
    "app_version": "1.4.2",
    "last_seen": "2026-02-07T12:00:00.000Z",
    "created_at": "2026-02-07T12:00:00.000Z"
  }
}

---

## 3) Send Role Notification (Admin Only)
Send a role-based broadcast. This is for admin tools; the mobile app does not need it.

- Method: POST
- Path: /api/notifications/role
- Auth: Required (ward_admin or super_admin)

Request body (JSON)
{
  "role": "citizen" | "councillor" | "ward_admin" | "officer",
  "title": "<title>",
  "body": "<body>",
  "data": {
    "type": "<type>",
    "screen": "<screen>",
    "extra": "<any string values>"
  }
}

Success response (example)
{
  "success": true,
  "message": "Role notification sent",
  "data": {
    "messageId": "projects/<project-id>/messages/<message-id>"
  }
}

---

## Payload Keys Used by Mobile App
All push payloads include a data section with these keys:
- type: complaint_created | complaint_status | announcement
- complaintId: number (for complaint notifications)
- announcementId: number (for announcement notifications)
- wardId: number (ward scoped)
- status: string (for complaint status updates)

---

## Announcement Ward Scoping (Optional)
To target a ward-specific announcement, include ward_id when creating announcements.
If omitted, the announcement is global.

- Path: /api/admin/announcement
- Field: ward_id (optional)

---

## Client Requirements (React Native)
- Use Firebase client config (google-services.json / GoogleService-Info.plist).
- Call register endpoint after login and on token refresh.
- Handle data payload for routing and deep links.
