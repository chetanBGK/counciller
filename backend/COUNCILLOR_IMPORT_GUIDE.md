# Kalyan-Dombivli Councillor Data Import Guide

## Overview
This guide shows how to import Kalyan-Dombivli Municipal Corporation councillor data into your wards database.

## Step-by-Step Instructions

### 1. Run Database Migrations (in order)

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database

# Step 1: Add cities table and ward foreign key
\i backend/database/add_cities_and_ward_fk.sql

# Step 2: Add councillor fields to wards table
\i backend/database/add_councillor_to_wards.sql

# Step 3: Import Kalyan-Dombivli councillor data
\i backend/database/seed_councillors_kalyan_dombivli.sql
```

### 2. Verify Data

```sql
-- Check if Kalyan-Dombivli city was created
SELECT * FROM cities WHERE name = 'Kalyan-Dombivli';

-- Check wards with councillor information
SELECT 
    id,
    name,
    number,
    councillor_name,
    councillor_party,
    councillor_phone
FROM wards 
WHERE city_id = (SELECT id FROM cities WHERE name = 'Kalyan-Dombivli')
ORDER BY number, name
LIMIT 10;

-- Count total wards
SELECT COUNT(*) FROM wards WHERE councillor_name IS NOT NULL;
```

## New API Endpoints

### 1. Get All Wards (with Councillor Info)
```http
GET /api/wards

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ward 1A",
      "number": 1,
      "councillor_name": "Varun Patil",
      "councillor_party": "BJP",
      "councillor_phone": "9763333376",
      "display_name": "Ward 1A - Varun Patil (BJP)",
      "city_name": "Kalyan-Dombivli"
    },
    {
      "id": 2,
      "name": "Ward 1B",
      "number": 1,
      "councillor_name": "Supriya Bhoir",
      "councillor_party": "Shiv Sena",
      "councillor_phone": "9657572561",
      "display_name": "Ward 1B - Supriya Bhoir (Shiv Sena)",
      "city_name": "Kalyan-Dombivli"
    }
  ]
}
```

### 2. Get Wards by City
```http
GET /api/wards?city_id=1

Filters wards by specific city
```

### 3. Get Ward by ID
```http
GET /api/wards/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ward 1A",
    "number": 1,
    "councillor_name": "Varun Patil",
    "councillor_party": "BJP",
    "councillor_phone": "9763333376",
    "city_name": "Kalyan-Dombivli",
    "centroid_lat": 19.2403,
    "centroid_lng": 73.1305
  }
}
```

### 4. Get Nearest Ward (existing)
```http
GET /api/wards/nearest?lat=19.2403&lng=73.1305

Returns the nearest ward with councillor info
```

## Database Schema Changes

### New Columns in `wards` table:
- `councillor_name` - VARCHAR(150) - Councillor's full name
- `councillor_party` - VARCHAR(100) - Political party
- `councillor_phone` - VARCHAR(50) - Contact number(s)
- `city_id` - INTEGER - Foreign key to cities table

## Data Format

The system now stores 124 wards from Kalyan-Dombivli with:
- Ward name (e.g., "Ward 1A", "Ward 2B")
- Ward number (1-31)
- Councillor name
- Political party affiliation
- Contact phone number(s)

### Ward Naming Convention:
- Major wards numbered 1-31
- Sub-divisions: A, B, C, D (e.g., 1A, 1B, 1C, 1D)
- Total: 124 wards

## Frontend Integration

### Display Ward Dropdown with Councillor Info
```javascript
// Fetch wards
const response = await fetch('/api/wards?city_id=1');
const { data } = await response.json();

// Display in dropdown
data.forEach(ward => {
  // Use display_name for user-friendly format
  // "Ward 1A - Varun Patil (BJP)"
  console.log(ward.display_name);
});
```

### Example Usage in Complaint Form
```javascript
<select name="ward_id">
  <option value="">Select Ward</option>
  {wards.map(ward => (
    <option key={ward.id} value={ward.id}>
      {ward.display_name}
    </option>
  ))}
</select>
```

## Benefits

1. **Better Ward Selection**: Users see ward number + councillor name
2. **Contact Information**: Direct access to councillor phone numbers
3. **Political Party Info**: Know which party represents each ward
4. **City Support**: Can extend to multiple cities/municipalities
5. **Duplicate Detection**: Ward-based complaint clustering improved

## Troubleshooting

### Issue: Ward numbers conflict
**Solution**: The system uses unique constraint on (city_id, number) to handle multiple sub-wards with same number

### Issue: Missing councillor data
**Solution**: Some wards may not have phone numbers (marked as NULL in database)

### Issue: Multiple phone numbers
**Solution**: Stored as comma-separated string (e.g., "9763333376, 8888888888")

## Next Steps

1. ✅ Import councillor data
2. ✅ Update ward API endpoints
3. 🔄 Update mobile app ward selection UI
4. 🔄 Add councillor dashboard showing their ward info
5. 🔄 Enable SMS notifications to councillors for new complaints

## Notes

- Ward numbers 1-31 may have multiple sub-wards (A, B, C, D)
- Some councillors won elected unopposed
- Multiple phone numbers are stored comma-separated
- NULL values indicate missing contact information
