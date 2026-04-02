# Officer Auto-Assignment & Authorization Update

**Date:** February 2, 2026

## Summary

Implemented automatic officer assignment when complaints are registered and updated authorization to support the new mobile app architecture where:
- **Citizens** use the Citizen Mobile App
- **Councillors, Ward Admins, and Officers** all use the same Councillor Mobile App
- **Ward Admins** have a separate Web Application when logged in from the web

---

## Changes Implemented

### 1. Database Schema Update

**File:** `database/add_assigned_officer_to_complaints.sql`

Added new columns to the `complaints` table:
- `assigned_officer_id` - References the officer assigned to handle the complaint based on category
- Foreign key constraint to `users` table
- Index for better query performance
- Also added missing columns: `reporter_id`, `priority_level`, `resolved_at`, `metadata`

**Migration Command:**
```bash
psql -U your_user -d your_database -f backend/database/add_assigned_officer_to_complaints.sql
```

---

### 2. Complaint Model Update

**File:** `src/models/complaint.model.js`

Updated the `create` function to include `assigned_officer_id` field in the INSERT statement.

**Changes:**
```javascript
INSERT INTO complaints (
  user_id, reporter_id, title, description, ward_id, category_id, 
  priority_level, priority, status, councillor_id, assigned_officer_id, 
  location, landmark, citizen_address, images, metadata, source_type, 
  created_at, updated_at
)
```

---

### 3. Complaint Service - Auto-Assignment Logic

**File:** `src/services/complaint.service.js`

Added automatic officer assignment based on category and ward when a complaint is created.

**Logic Flow:**
1. **Councillor Assignment** (existing): Finds councillor for the ward
2. **Officer Assignment** (new): Finds officer assigned to handle the complaint's category in that ward

```javascript
// Auto-assign officer based on category and ward
let assignedOfficerId = null;
if (body.category_id && wardId) {
  const officerRes = await client.query(
    `SELECT u.id, u.name, u.phone 
     FROM users u
     INNER JOIN officer_categories oc ON u.id = oc.officer_id
     WHERE oc.category_id = $1 
       AND oc.ward_id = $2 
       AND u.role IN ('officer', 'operator')
     LIMIT 1`,
    [body.category_id, wardId]
  );
  
  if (officerRes.rows.length > 0) {
    assignedOfficerId = officerRes.rows[0].id;
  }
}
```

**Benefits:**
- Complaints are instantly routed to the right officer
- No manual assignment needed
- Based on the officer-category mapping system

---

### 4. Authorization Updates

Updated route access control to support the new architecture:

#### **Councillor Routes** (`src/routes/councillor.routes.js`)

| Route | Access | Notes |
|-------|--------|-------|
| `GET /me` | councillor, ward_admin, officer, operator | Profile access for all mobile app users |
| `GET /dashboard` | councillor, ward_admin, officer, operator | Dashboard for all mobile app users |
| `GET /complaints` | councillor, ward_admin, officer, operator | View complaints |
| `PUT /approve/:id` | **councillor only** | Only councillors approve |
| `PUT /in-progress/:id` | councillor, officer, operator | Officers can update status |
| `PUT /complete/:id` | councillor, officer, operator | Officers can complete |
| `PUT /confirm/:id` | councillor, officer, operator | Officers can confirm |
| `POST /note/:id` | councillor, ward_admin, officer, operator | All can add notes |
| `POST /promote-citizen` | **councillor only** | Only councillors promote to ward admin |
| `DELETE /ward-admin/:admin_id` | **councillor only** | Only councillors demote ward admin |
| `GET /ward-stats/*` | councillor, ward_admin, officer, operator | Statistics for all |

#### **Admin Routes** (`src/routes/admin.routes.js`)

| Route | Access | Notes |
|-------|--------|-------|
| `POST /announcement` | ward_admin only | Create announcements |
| `GET /announcements` | councillor, ward_admin, officer, operator | View announcements |
| `POST /category` | ward_admin only | Create categories |
| `GET /category` | councillor, ward_admin, officer, operator | View categories |
| `GET /categories/:categoryId/officers` | councillor, ward_admin, officer, operator | View officers by category |
| `GET /users` | councillor, ward_admin, officer, operator | View citizens |
| `GET /userdetails` | councillor, ward_admin, officer, operator | View citizen details |
| `GET /wards` | councillor, ward_admin, officer, operator | View wards |
| `GET /complaints/my` | councillor, ward_admin, officer, operator | View ward complaints |
| `GET /dashboard-stats` | ward_admin, councillor, officer, operator | Dashboard statistics |

#### **Complaint Routes** (`src/routes/complaint.routes.js`)

All complaint routes remain protected by `authMiddleware` only, allowing any authenticated user to access based on their relationship to the complaint.

---

## Mobile App Architecture

### **Citizen Mobile App**
- **Users:** Citizens only
- **Role:** `citizen`
- **Features:**
  - Register complaints
  - View own complaints
  - Track complaint status
  - View ward information
  - Voter ID verification

### **Councillor Mobile App**
- **Users:** Councillors, Ward Admins, Officers, Operators
- **Roles:** `councillor`, `ward_admin`, `officer`, `operator`
- **Features:**
  - View and manage complaints
  - Update complaint status
  - Add notes and attachments
  - View ward statistics
  - Manage citizens
  - View categories and officers
  - Dashboard with analytics

### **Ward Admin Web Application**
- **Users:** Ward Admins only (when logged in from web)
- **Role:** `ward_admin`
- **Features:**
  - Create categories
  - Create announcements
  - Manage officers
  - Assign categories to officers
  - Create wards
  - Full administrative access

---

## Authorization Matrix

| Feature | Citizen | Councillor | Ward Admin (Mobile) | Ward Admin (Web) | Officer | Super Admin |
|---------|---------|------------|---------------------|------------------|---------|-------------|
| Create Complaint | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Complaints | Own only | Ward | Ward | Ward | Assigned/Ward | All |
| Approve Complaint | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Update Status | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Add Notes | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Categories | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Assign Officers | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Promote Ward Admin | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Statistics | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## API Response Changes

When fetching complaint details, the response now includes:

```json
{
  "id": 123,
  "title": "Street Light Not Working",
  "description": "...",
  "status": "submitted",
  "councillor_id": 45,
  "councillor_name": "John Doe",
  "assigned_officer_id": 67,
  "assigned_officer_name": "Officer Kumar",
  "category_id": 5,
  "category_name": "Street Lights",
  "ward_id": 10,
  "ward_name": "Ward 45",
  "created_at": "2026-02-02T10:00:00Z"
}
```

---

## How Officer Assignment Works

### Pre-requisites
1. Officer must be created in the system (role: `officer` or `operator`)
2. Officer must be assigned to a ward
3. Officer must be mapped to specific categories using the officer-category mapping system

### Mapping Officers to Categories
Ward admins or councillors can assign categories to officers:

```http
POST /api/admin/officers/assign-category
Authorization: Bearer <token>
Content-Type: application/json

{
  "officer_id": 67,
  "category_id": 5,
  "ward_id": 10
}
```

### During Complaint Creation
When a citizen creates a complaint:
1. System identifies the ward (from citizen's profile or selected ward)
2. System identifies the category (from complaint details)
3. System queries `officer_categories` table to find officer assigned to handle that category in that ward
4. Officer is automatically assigned to the complaint via `assigned_officer_id`
5. Councillor is also assigned via `councillor_id`

---

## Testing Checklist

### ✅ Database Migration
- [ ] Run the migration SQL file
- [ ] Verify `assigned_officer_id` column exists in `complaints` table
- [ ] Verify foreign key constraint is created
- [ ] Verify index is created

### ✅ Officer Assignment
- [ ] Create a test officer
- [ ] Assign officer to a category in a ward
- [ ] Create a complaint with that category
- [ ] Verify officer is auto-assigned in the complaint

### ✅ Mobile App Access (Councillor App)
- [ ] Councillor can view dashboard
- [ ] Ward admin can view dashboard
- [ ] Officer can view dashboard
- [ ] Officer can view complaints assigned to them
- [ ] Officer can update complaint status (in-progress, complete)
- [ ] Officer cannot approve complaints (councillor only)
- [ ] Ward admin cannot promote citizens (councillor only)

### ✅ Web App Access (Ward Admin Web)
- [ ] Ward admin can create categories
- [ ] Ward admin can assign officers to categories
- [ ] Ward admin can create announcements
- [ ] Ward admin can manage wards

### ✅ Citizen App
- [ ] Citizens can only create complaints
- [ ] Citizens cannot access admin/councillor routes
- [ ] Citizens can view only their own complaints

---

## Migration Steps

1. **Backup Database**
   ```bash
   pg_dump -U your_user -d your_database > backup_$(date +%Y%m%d).sql
   ```

2. **Run Migration**
   ```bash
   psql -U your_user -d your_database -f backend/database/add_assigned_officer_to_complaints.sql
   ```

3. **Restart Backend**
   ```bash
   cd backend
   npm restart
   ```

4. **Test Officer Assignment**
   - Create test officer
   - Assign to category
   - Create complaint
   - Verify assignment

5. **Test Mobile App Access**
   - Login as officer
   - Verify dashboard access
   - Verify complaint access
   - Test status updates

---

## Troubleshooting

### Officer Not Being Assigned
- Verify officer exists with role `officer` or `operator`
- Check `officer_categories` table for category mapping
- Ensure ward_id matches between complaint, officer, and category mapping
- Check console logs during complaint creation for assignment messages

### Authorization Issues
- Verify JWT token includes correct role
- Check roleMiddleware is receiving expected roles
- Verify authMiddleware is setting req.user correctly
- Check route definitions for correct role allowances

### Web vs Mobile Access
- Ward admins use same authentication but different apps
- Routes should detect context (not implemented - can be added via user-agent or app version header)
- Currently, all routes are accessible regardless of app, but permissions are role-based

---

## Future Enhancements

1. **Multi-Officer Assignment**: Assign multiple officers to same complaint for collaboration
2. **Officer Workload Balancing**: Distribute complaints evenly among officers
3. **Officer Notifications**: Notify officers when complaints are assigned
4. **Officer Performance Metrics**: Track resolution times and complaint counts per officer
5. **App Context Detection**: Differentiate between mobile and web access for ward admins
6. **Officer Specialization**: Allow officers to have expertise levels in categories
7. **Auto-Reassignment**: Reassign if officer is unavailable or overloaded

---

## Related Documentation

- [OFFICER_CATEGORY_MAPPING.md](./OFFICER_CATEGORY_MAPPING.md) - Officer-category mapping system
- [API_COMPLETE_DOCUMENTATION.md](./API_COMPLETE_DOCUMENTATION.md) - Complete API reference
- [WARD_ADMIN_COMPLETE_CODE.md](./WARD_ADMIN_COMPLETE_CODE.md) - Ward admin management
- [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md) - Authentication system

---

## Success! ✅

All changes have been implemented and are ready for testing. The system now:
1. ✅ Auto-assigns officers based on category when complaints are registered
2. ✅ Supports councillors, ward admins, and officers using the same mobile app
3. ✅ Maintains proper authorization for different roles
4. ✅ Restricts ward admin promotion to councillors only
5. ✅ Allows officers to update complaint status but not approve
6. ✅ Provides appropriate access levels for all roles
