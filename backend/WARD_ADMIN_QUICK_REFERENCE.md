# Ward Admin Management - Quick Reference Card

## 🎯 Feature Overview

| Feature | Endpoint | Method | Auth | Input | Output |
|---------|----------|--------|------|-------|--------|
| Promote Citizen | `/api/councillor/promote-citizen` | POST | Bearer | citizen_id | User + temp_password |
| Demote Admin | `/api/councillor/ward-admin/:admin_id` | DELETE | Bearer | admin_id (URL) | User |

---

## 🔑 Key Endpoints

### 1️⃣ Promote Citizen to Ward Admin
```
POST http://localhost:5000/api/councillor/promote-citizen
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "citizen_id": 50
}
```

**Returns:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 50, "name": "Alice", "role": "ward_admin" },
    "temp_password": "A1B2C3D4E5F6"  ⚠️ SHOW ONLY ONCE
  }
}
```

### 2️⃣ Demote Ward Admin to Citizen
```
DELETE http://localhost:5000/api/councillor/ward-admin/50
Authorization: Bearer YOUR_JWT_TOKEN
```

**Returns:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 50, "name": "Alice", "role": "citizen" }
  }
}
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---|
| Password Generation | `crypto.randomBytes(6).toString('hex').toUpperCase()` |
| Password Hashing | Bcrypt with 10 salt rounds |
| Storage | Only hash stored, never plain text |
| Display | Only shown once at promotion |
| Authorization | Bearer token + councillor role + ward verification |
| Audit | All actions logged with timestamp |

---

## 📊 Role Changes

### Promotion Flow
```
citizen → ward_admin
password_hash: NULL → bcrypt_hash
access: citizen panel → ward admin panel
```

### Demotion Flow
```
ward_admin → citizen
password_hash: bcrypt_hash → NULL
access: ward admin panel → citizen panel
```

---

## ✅ Pre-Testing Checklist

- [ ] API server running on http://localhost:5000
- [ ] JWT token obtained from `/auth/verify-otp`
- [ ] Councillor ID and token saved
- [ ] Citizen ID to promote identified
- [ ] Postman installed (or use curl)
- [ ] Database accessible for verification

---

## 🧪 Testing Steps (Quick)

### Step 1: Promote
```bash
curl -X POST http://localhost:5000/api/councillor/promote-citizen \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"citizen_id": 50}'
```

**Save:** temp_password from response

### Step 2: Verify in DB
```sql
SELECT id, name, role, password_hash FROM users WHERE id = 50;
-- Should show: role='ward_admin', password_hash is NOT NULL
```

### Step 3: Demote
```bash
curl -X DELETE http://localhost:5000/api/councillor/ward-admin/50 \
  -H "Authorization: Bearer TOKEN"
```

### Step 4: Verify in DB
```sql
SELECT id, name, role, password_hash FROM users WHERE id = 50;
-- Should show: role='citizen', password_hash is NULL
```

---

## 🐛 Error Messages & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `citizen_id is required` | Missing parameter | Add `{"citizen_id": 50}` to body |
| `Citizen not found` | Invalid ID | Check citizen ID exists |
| `Can only promote citizens from your ward` | Wrong ward | Use citizen from same ward |
| `401 Unauthorized` | No/invalid token | Get token from `/auth/verify-otp` |
| `403 Forbidden` | Wrong role | Must be councillor role |
| `Ward Admin not found` | Invalid admin ID | Check admin ID is ward_admin role |

---

## 📝 Password Format

**Generated:** 12 hexadecimal characters (uppercase)
- Example: `A1B2C3D4E5F6`
- Length: 12 characters
- Characters: 0-9, A-F only
- Format: crypto.randomBytes(6).toString('hex').toUpperCase()

**After Hashing:** Bcrypt hash (60+ characters)
- Example: `$2b$10$abcdefghijklmnopqrstuvwxyz...`
- Storage: Database password_hash column
- Verification: bcrypt.compare(password, hash)

---

## 🔐 Authentication Details

**Token Required:** JWT Bearer Token
- Get from: `POST /auth/verify-otp`
- Include as: `Authorization: Bearer YOUR_TOKEN`
- Role: 'councillor' or 'councillor_admin'
- Ward Match: Citizen/Admin must be in same ward

---

## 📡 API Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 201 | Created (promotion) | Citizen successfully promoted |
| 200 | OK (demotion) | Ward admin successfully demoted |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Wrong role or ward |
| 500 | Server Error | Database error |

---

## 🗄️ Database Changes

**Users Table Updates:**

Promotion:
```sql
UPDATE users 
SET role = 'ward_admin', password_hash = 'bcrypt_hash'
WHERE id = 50
```

Demotion:
```sql
UPDATE users 
SET role = 'citizen', password_hash = NULL
WHERE id = 50
```

**Audit Log:**
```sql
INSERT INTO audit_logs (action, table_name, record_id, performed_by)
VALUES ('PROMOTE_TO_WARD_ADMIN', 'users', 50, 1)
```

---

## 📋 Files Modified/Created

### Modified:
- ✅ `src/services/councillor.service.js` - 2 new methods
- ✅ `src/controllers/councillor.controller.js` - 2 new exports
- ✅ `src/routes/councillor.routes.js` - 2 new routes

### Created:
- ✅ `WARD_ADMIN_MANAGEMENT_API.md` - Full API docs
- ✅ `WARD_ADMIN_TESTING_GUIDE.md` - Testing steps
- ✅ `WARD_ADMIN_IMPLEMENTATION_SUMMARY.md` - Implementation details
- ✅ `WARD_ADMIN_COMPLETE_CODE.md` - Full source code
- ✅ `WARD_ADMIN_IMPLEMENTATION_VERIFICATION.md` - Verification checklist
- ✅ `WARD_ADMIN_QUICK_REFERENCE.md` - This file

---

## 🚀 Quick Postman Import

1. Copy this JSON into Postman as collection:
```json
{
  "name": "Ward Admin",
  "item": [
    {
      "name": "Promote Citizen",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/councillor/promote-citizen",
        "body": { "raw": "{\"citizen_id\": 50}" }
      }
    },
    {
      "name": "Demote Admin",
      "request": {
        "method": "DELETE",
        "url": "{{base_url}}/api/councillor/ward-admin/50"
      }
    }
  ]
}
```

2. Set variables:
   - `base_url`: http://localhost:5000
   - `councillor_token`: YOUR_JWT_TOKEN

3. Run requests

---

## 📞 Support Information

### If Promotion Fails:
1. Check citizen_id exists: `SELECT * FROM users WHERE id = 50`
2. Check citizen role: `SELECT role FROM users WHERE id = 50` (should be 'citizen')
3. Check same ward: `SELECT ward_id FROM users WHERE id = 50` (should match councillor's ward_id)
4. Check councillor role: `SELECT role FROM users WHERE id = 1` (should be 'councillor')
5. Check token valid: Verify JWT not expired

### If Demotion Fails:
1. Check admin_id exists: `SELECT * FROM users WHERE id = 50`
2. Check admin role: `SELECT role FROM users WHERE id = 50` (should be 'ward_admin')
3. Check same ward: `SELECT ward_id FROM users WHERE id = 50` (should match councillor's ward_id)

---

## 🎓 Learning Resources

| Topic | File |
|-------|------|
| API Details | WARD_ADMIN_MANAGEMENT_API.md |
| Testing Guide | WARD_ADMIN_TESTING_GUIDE.md |
| Full Code | WARD_ADMIN_COMPLETE_CODE.md |
| Implementation | WARD_ADMIN_IMPLEMENTATION_SUMMARY.md |
| Verification | WARD_ADMIN_IMPLEMENTATION_VERIFICATION.md |

---

## ⚡ Common Tasks

### Task 1: Promote Multiple Citizens
```bash
# Loop through citizen IDs
for citizen in 50 51 52; do
  curl -X POST http://localhost:5000/api/councillor/promote-citizen \
    -H "Authorization: Bearer TOKEN" \
    -d "{\"citizen_id\": $citizen}"
done
```

### Task 2: List All Ward Admins
```bash
curl http://localhost:5000/api/councillor/ward-admins \
  -H "Authorization: Bearer TOKEN"
```

### Task 3: Check if User is Ward Admin
```sql
SELECT id, name, role FROM users WHERE role = 'ward_admin' AND ward_id = 101
```

---

## 📌 Important Notes

⚠️ **Password Management:**
- ✓ Temporary password shown ONLY once
- ✓ Never show again (not retrievable)
- ✓ Only stored as bcrypt hash
- ✓ Share securely with ward admin
- ✓ Should be changed on first login (future feature)

⚠️ **Ward Verification:**
- ✓ Only promote/demote citizens/admins in your ward
- ✓ Cross-ward operations will fail
- ✓ Prevents unauthorized access

⚠️ **Audit Trail:**
- ✓ All operations logged
- ✓ Cannot be undone (only demoted back)
- ✓ Timestamp recorded automatically

---

## Version Info
- **Version:** 1.0.0
- **Status:** Ready for Testing
- **Last Updated:** 2024
- **Documentation:** Complete

---

**For detailed information, refer to the complete documentation files.**
