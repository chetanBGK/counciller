# AI Complaints - Quick Reference

## Setup

1. **Seed Categories** (run once in psql):
```sql
\i database/seed_categories.sql
```

2. **Verify OpenAI Key** in `.env`:
```
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

3. **Get Auth Token**: Login as citizen/councillor to get JWT token

---

## Endpoints

### 1. Create AI-Powered Complaint

**POST** `/api/ai/complaints`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Broken water pipe on MG Road",
  "description": "Main water supply pipe burst near the bus stop. Water flooding the street since morning. Urgent repair needed.",
  "lat": 19.2189,
  "lng": 73.0984,
  "images": ["data:image/jpeg;base64,/9j/4AAQ..."],
  "videos": []
}
```

**What It Does:**
1. ✅ Uploads images/videos to Cloudinary
2. 🤖 Analyzes complaint via OpenAI:
   - Extracts category (water, electricity, road, etc.)
   - Determines priority (low/medium/high)
   - Extracts address components
3. 📍 Finds nearest ward using Haversine distance
4. 💾 Creates complaint in database
5. 📊 Returns complaint with AI metadata

**Response:**
```json
{
  "status": "success",
  "message": "Complaint created via AI",
  "data": {
    "id": 123,
    "user_id": 5,
    "title": "Broken water pipe on MG Road",
    "description": "...",
    "ward_id": 83,
    "category_id": 1,
    "priority": 3,
    "status": "submitted",
    "metadata": {
      "ai": {
        "summary": "Water supply pipe burst causing flooding...",
        "category": "water",
        "priority": "high",
        "address": {...}
      },
      "media": {
        "images": ["https://res.cloudinary.com/.../image.jpg"],
        "videos": []
      }
    }
  }
}
```

---

### 2. Nearest Ward Lookup

**GET** `/api/wards/nearest?lat=19.2189&lng=73.0984`

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 83,
    "name": "Kalyan-Dombivli (M Corp.) - Ward No.83",
    "number": 83,
    "city_id": 1,
    "city_name": "Kalyan-Dombivli",
    "city_state": "Maharashtra",
    "centroid_lat": 19.2110776051959,
    "centroid_lng": 73.0984144889107,
    "distance_m": 234.56
  }
}
```

---

## Test Examples

### Example 1: Water Supply Issue
```bash
curl -X POST http://localhost:3000/api/ai/complaints \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No water supply since 2 days",
    "description": "Our area in Shastri Nagar has no water supply. Tank is empty. Please send water tanker urgently.",
    "lat": 19.2328,
    "lng": 73.0906
  }'
```

### Example 2: Road Issue
```bash
curl -X POST http://localhost:3000/api/ai/complaints \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pothole causing accidents",
    "description": "Large pothole on Station Road near Hanuman Temple. Already 2 bike accidents happened. Need immediate repair.",
    "lat": 19.2221,
    "lng": 73.1081
  }'
```

### Example 3: With Image (Base64)
```bash
curl -X POST http://localhost:3000/api/ai/complaints \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Garbage not collected for a week",
    "description": "Waste bins overflowing. Dogs spreading garbage everywhere. Health hazard.",
    "lat": 19.2396,
    "lng": 73.1366,
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."]
  }'
```

---

## AI Category Mapping

The AI suggests one of these categories (auto-mapped to DB):
- `water` → Water Supply
- `electricity` → Electricity
- `waste` → Waste Management
- `road` → Road & Infrastructure
- `transport` → Transport
- `health` → Health & Sanitation
- `education` → Education
- `other` → Other

If AI suggests an unknown category, `category_id` will be `null`.

---

## Notes

- **Images/Videos**: Optional. Pass as base64 strings or omit entirely.
- **Priority**: AI determines from urgency keywords (urgent, immediate, ASAP → high).
- **Ward Assignment**: Automatic via lat/lng. No manual ward selection needed.
- **Fallback**: If OpenAI fails, you can still create complaints manually via `/api/complaints`.

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `AI service is not configured` | Missing OPENAI_API_KEY | Add key to `.env` |
| `Authentication required` | Missing/invalid JWT | Login first |
| `No ward found` | Invalid lat/lng or no wards in DB | Check coordinates |
| `Category not found` | AI returned unmapped category | Add to `categories` table |

---

## Advanced: Multipart Upload (Optional)

If you prefer file uploads over base64, I can add `multer` support:
```javascript
// Would accept files directly
FormData: { title, description, lat, lng, images: [File], videos: [File] }
```

Let me know if you need this!
