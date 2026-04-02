# Voter ID Verification API

## Setup

### 1. Run Database Migration
```sql
psql -U your_user -d your_database -f src/database/create_api_tokens_table.sql
```

### 2. Update Token (When Expired)
**Method:** PUT  
**Endpoint:** `/api/verification/update-token`  
**Auth:** Super Admin only  
**Headers:**
```
Authorization: Bearer <super_admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "NEW_BEARER_TOKEN_FROM_SUREPASS",
  "expires_at": "2026-03-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API token updated successfully",
  "data": {
    "success": true,
    "expires_at": "2026-03-31T23:59:59.000Z"
  }
}
```

---

## Voter ID Verification

### Verify Voter ID
**Method:** POST  
**Endpoint:** `/api/verification/voter-id`  
**Auth:** Required (any authenticated user)  
**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "voter_id": "UWW1271428"
}
```

---

### Successful Verification Response (200 OK)
```json
{
  "success": true,
  "message": "Voter ID verified successfully",
  "data": {
    "verified": true,
    "voter_details": {
      "client_id": "voter_QkvMwfprgEucEooueyls",
      "input_voter_id": "UWW1271428",
      "epic_no": "UWW1271428",
      "gender": "M",
      "state": "Tamil Nadu",
      "name": "SELVA PRAKASH",
      "relation_name": "RAMESH BABU",
      "relation_type": "FTHR",
      "house_no": null,
      "dob": null,
      "age": "29",
      "area": "Lakshmi Matriculation Higher Secondary School, Kovilpatti Road, Manapparai...",
      "district": "Tiruchirappalli",
      "assembly_constituency": "Manapparai",
      "assembly_constituency_number": "138",
      "polling_station": "Lakshmi Matriculation Higher Secondary School...",
      "part_number": "111",
      "slno_inpart": "362",
      "section_no": "1",
      "name_v1": "செல்வ பிரகாஷ்",
      "rln_name_v1": "ரமேஷ்பாபு",
      "parliamentary_name": "Karur",
      "parliamentary_number": "23",
      "st_code": "S22",
      "id": "55139460_UWW1271428_S22"
    },
    "message": null
  }
}
```

---

### Failed Verification Response (200 OK - Invalid Voter ID)
```json
{
  "success": true,
  "message": "Voter ID verification failed",
  "data": {
    "verified": false,
    "voter_details": null,
    "message": "Verification Failed"
  }
}
```

---

### Service Error Response (503 Service Unavailable)
```json
{
  "success": false,
  "message": "Verification service temporarily unavailable. Please try again later."
}
```

---

## Token Management

### Automatic Token Handling
- Token is stored in `api_tokens` database table
- Service automatically checks token expiry before each request
- If token is expired, it attempts to refresh (placeholder implementation)

### Manual Token Update (When Token Expires)
1. Get new token from Surepass
2. Call `PUT /api/verification/update-token` as super admin
3. Token is automatically used for subsequent verification requests

### Database Query to Update Token Manually
```sql
UPDATE api_tokens 
SET 
  token = 'NEW_TOKEN_HERE',
  expires_at = '2026-03-31 23:59:59',
  updated_at = NOW()
WHERE provider = 'surepass_voter_id';
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success (verified or not verified) |
| 400 | Bad request (missing voter_id) |
| 401 | Unauthorized (no auth token) |
| 403 | Forbidden (not super admin for token update) |
| 503 | Service unavailable (Surepass API error) |

---

## Notes

1. **Token Refresh**: The automatic token refresh is a placeholder. Update `refreshToken()` function in `surepass.service.js` with actual Surepass auth endpoint when available.

2. **Audit Trail**: All verification attempts are logged in the audit_logs table with user ID, timestamp, and result.

3. **Security**: 
   - Only super admins can update tokens
   - Tokens are stored securely in database
   - All requests are authenticated

4. **Response Format**: The API returns the complete Surepass response to frontend, allowing you to display all voter details.

5. **Environment Variables** (optional):
   ```env
   SUREPASS_CLIENT_ID=your_client_id
   SUREPASS_CLIENT_SECRET=your_client_secret
   ```
