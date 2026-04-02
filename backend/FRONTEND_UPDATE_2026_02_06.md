# Frontend Update Notes (2026-02-06)

Applies to: Citizen, Councillor, Ward Admin, Super Admin apps.

## ✅ New/Updated APIs

### Complaints — Comments (Threaded)
- **GET** `/api/complaints/:id/comments`
- **POST** `/api/complaints/:id/comments`

**Access**: reporter, assigned officer/operator, ward admin, super admin, councillor of same ward

**POST request**:
```json
{ "comment": "Inspection completed." }
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 11,
    "complaint_id": 42,
    "user_id": 7,
    "comment": "Inspection completed.",
    "created_at": "2026-02-06T11:05:00Z"
  }
}
```

### Complaints — Ratings (Citizen)
- **GET** `/api/complaints/:id/rating`
- **POST** `/api/complaints/:id/rating`

**Rules**:
- Only the complaint reporter can rate.
- Allowed when status is `resolved`, `closed`, or `citizen_confirmed`.
- One rating per complaint.

**POST request**:
```json
{ "rating": 5, "comment": "Great response" }
```

### Reports & Downloads (Ward Admin)
- **GET** `/api/reports/complaints`
- **GET** `/api/reports/complaints/export?format=excel|pdf`

**Filters**: `from_date`, `to_date`, `complaint_type` (`ai|manual|all`), `category_id`, `status`, `location`, `repeated_only`
Headers: Authorization: Bearer <token>
Query params (as needed):
from_date, to_date, complaint_type (ai|manual|all), category_id, status, location, repeated_only
**Response (summary)**:
```json
{
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
```

## ✅ Response Schema Changes

### Complaint Detail (`GET /api/complaints/:id`)
Added fields for parity with list:
- `notes` (same as `comments` from `complaint_updates`)
- `reporter_name`, `reporter_phone`
- `councillor_name`
- `comment_threads` (threaded comments from `complaint_comments`)

## ✅ Request Schema Changes

### Create Ward (`POST /api/admin/ward`)
New optional field:
```json
{ "sub_ward_code": "A" }
```
Used for wards like 1A/1B/etc. Ward `name` remains unchanged.

## ✅ Behavior Changes

### AI complaint source_type
- AI complaints now save `source_type = ai_complaint`
- AI chat complaints now save `source_type = ai_chat`
- Manual complaints keep `source_type = mobile_app`

### Role normalization
- `wardadmin` / `councillor_admin` → `ward_admin`
- `superadmin` → `super_admin`

### Required ward_id
Creation of `councillor`, `ward_admin`, `officer`, `operator` requires `ward_id`.

## ✅ Summary by App

### Citizen App
- Can read and add complaint comments (if reporter).
- Can rate complaint after resolution.
- Complaint detail includes `comment_threads` and `notes`.

### Councillor App
- Can add comments and change status.
- Complaint detail includes `reporter_name` and `reporter_phone`.

### Ward Admin App
- Reports & downloads API available.
- Can add comments and change status.
- Ward creation accepts `sub_ward_code`.

### Super Admin App
- Councillor creation requires `ward_id`.

## ⚙️ Dependencies (Backend)
- Added `json2csv`, `pdfkit` for report exports.

---

If you want the OpenAPI spec updated too, ask and I’ll add it.
