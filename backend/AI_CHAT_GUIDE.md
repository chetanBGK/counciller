# AI Chat - Conversational Complaint Registration

## Overview

The AI Chat endpoint provides an **intelligent conversational interface** for citizens to register complaints. The AI assistant asks follow-up questions to understand the complaint clearly before automatically creating it in the correct category with proper ward and councillor assignment.

## Key Features

✅ **Multi-turn conversations** - AI asks clarifying questions
✅ **Ward validation** - Citizens can only complain in their own ward
✅ **Auto-categorization** - AI determines correct category from conversation
✅ **Priority assessment** - AI evaluates urgency (low/medium/high)
✅ **Media support** - Upload images/videos during conversation
✅ **Session management** - In-memory sessions (30 min timeout)
✅ **Token optimization** - Only last 6 messages sent to OpenAI

---

## API Endpoints

### 1. POST /api/ai/chat

Start or continue a conversation to register a complaint.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
```
session_id (optional) - UUID for session continuity (auto-generated on first message)
message (optional) - Text message from citizen
latitude (optional) - Location latitude (required before complaint creation)
longitude (optional) - Location longitude (required before complaint creation)
images (optional) - Up to 5 image files
videos (optional) - Up to 2 video files
```

**Response Types:**

**A) Greeting (first message):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "greeting",
  "message": "Hello Rajesh! 👋 I'm here to help you register your complaint...",
  "extracted_so_far": {
    "category": null,
    "priority": null,
    "title": null,
    "description": null,
    "latitude": null,
    "longitude": null,
    "ward_id": null,
    "clarity": 0
  }
}
```

**B) Follow-up question:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "question",
  "message": "I can see the road damage in the photo. Which street or landmark is this near?",
  "extracted_so_far": {
    "category": "Road & Infrastructure",
    "priority": "medium",
    "title": null,
    "description": null,
    "latitude": 19.2328,
    "longitude": 73.0906,
    "ward_id": 5,
    "clarity": 50
  }
}
```

**C) Complaint created:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "complaint_created",
  "message": "✅ Complaint #123 registered successfully! Assigned to Councillor Ramesh Kumar.",
  "complaint": {
    "id": 123,
    "title": "Pothole on MG Road causing vehicle skids",
    "category": "Road & Infrastructure",
    "priority": "high",
    "ward_id": 5,
    "councillor_id": 12,
    "status": "pending"
  }
}
```

**D) Ward validation error:**
```json
{
  "error": "This location is in Ward 10 (Kalyan East), but you belong to Ward 5 (Dombivli West). You can only register complaints in your own ward.",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "citizen_ward": {
    "id": 5,
    "name": "Dombivli West",
    "number": 5
  },
  "location_ward": {
    "id": 10,
    "name": "Kalyan East",
    "number": 10
  }
}
```

---

### 2. GET /api/ai/chat/stats

Get active session statistics (admin only).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "active_sessions": 3,
  "sessions": [
    {
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "citizen_id": 42,
      "messages_count": 6,
      "clarity": 75,
      "inactive_minutes": 5
    }
  ]
}
```

---

## Usage Examples

### Example 1: Text-only conversation

**Request 1 (Start):**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "message=There is a water leakage in my street"
```

**Response 1:**
```json
{
  "session_id": "abc-123",
  "type": "question",
  "message": "I understand there's a water leakage. Can you tell me which street or area this is happening in?",
  "extracted_so_far": {
    "category": "Water Supply",
    "clarity": 25
  }
}
```

**Request 2 (Continue):**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "session_id=abc-123" \
  -F "message=MG Road near the school" \
  -F "latitude=19.2328" \
  -F "longitude=73.0906"
```

**Response 2:**
```json
{
  "session_id": "abc-123",
  "type": "question",
  "message": "Is this a minor leak or is it flooding the street? Is it affecting water supply to nearby homes?",
  "extracted_so_far": {
    "category": "Water Supply",
    "ward_id": 5,
    "clarity": 50
  }
}
```

**Request 3 (Final):**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "session_id=abc-123" \
  -F "message=It's a major leak, water is flooding the road and many houses have no water"
```

**Response 3 (Created):**
```json
{
  "session_id": "abc-123",
  "type": "complaint_created",
  "message": "✅ I've registered a HIGH priority Water Supply complaint for you!",
  "complaint": {
    "id": 456,
    "title": "Major water leakage on MG Road causing flooding and supply disruption",
    "category": "Water Supply",
    "priority": "high"
  }
}
```

---

### Example 2: Image with text

**Request:**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "message=Look at this pothole" \
  -F "images=@pothole.jpg" \
  -F "latitude=19.2328" \
  -F "longitude=73.0906"
```

**Response:**
```json
{
  "session_id": "xyz-789",
  "type": "question",
  "message": "I can see the pothole in the image. It looks quite large. Is this blocking traffic or causing any accidents?",
  "extracted_so_far": {
    "category": "Road & Infrastructure",
    "ward_id": 5,
    "clarity": 50
  }
}
```

---

### Example 3: JavaScript/React usage

```javascript
// Initialize chat session
let sessionId = null;

async function sendChatMessage(message, images = [], location = null) {
  const formData = new FormData();
  
  if (sessionId) {
    formData.append('session_id', sessionId);
  }
  
  if (message) {
    formData.append('message', message);
  }
  
  if (location) {
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
  }
  
  images.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  
  // Store session ID for continuity
  if (data.session_id) {
    sessionId = data.session_id;
  }
  
  return data;
}

// Example usage
const result = await sendChatMessage(
  "There is garbage not collected for 3 days",
  [],
  { lat: 19.2328, lng: 73.0906 }
);

if (result.type === 'question') {
  console.log('AI asks:', result.message);
  // Show AI message to user
  // Wait for user response
}

if (result.type === 'complaint_created') {
  console.log('Complaint created!', result.complaint);
  // Show success message
  sessionId = null; // Reset session
}
```

---

## Conversation Flow

```
┌─────────────┐
│   START     │
│ First msg   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│   AI Greeting    │
│ "Hello! How can  │
│  I help you?"    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐     ┌─────────────────┐
│  User describes  │────▶│ Extract info:   │
│  complaint       │     │ - Category      │
│  (text/image)    │     │ - Priority      │
└──────┬───────────┘     │ - Keywords      │
       │                 └─────────────────┘
       │
       ▼
┌──────────────────┐
│  Clarity < 100%? │─Yes─┐
└──────┬───────────┘     │
       │No               │
       │                 ▼
       │          ┌──────────────┐
       │          │ Ask follow-up│
       │          │   question   │
       │          └──────┬───────┘
       │                 │
       │                 │
       │          ┌──────▼───────┐
       │          │ User replies │
       │          └──────┬───────┘
       │                 │
       │                 └────────┐
       │                          │
       ▼                          ▼
┌──────────────────┐     ┌───────────────┐
│ Validate ward    │◀────│ Location      │
│ (citizen's ward  │     │ provided?     │
│  matches loc)    │     └───────────────┘
└──────┬───────────┘
       │Valid
       ▼
┌──────────────────┐
│ Create complaint │
│ - Map category   │
│ - Assign ward    │
│ - Assign council │
│ - Store media    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  ✅ SUCCESS      │
│ Complaint #123   │
│ Delete session   │
└──────────────────┘
```

---

## Ward Validation Rules

1. **Citizen's ward from profile** (users.ward_id) is the authoritative source
2. **Location must be in citizen's ward:**
   - Find nearest ward using lat/lng
   - Compare with citizen's ward_id
   - Reject if mismatch
3. **Distance threshold:** Max 5km from ward centroid
4. **Error messages are descriptive:**
   - Show both citizen's ward and detected ward
   - Explain the restriction clearly

---

## Session Management

- **Storage:** In-memory Map (not database)
- **Timeout:** 30 minutes of inactivity
- **Cleanup:** Automatic every 5 minutes
- **Scope:** Per citizen (user_id + session_id)
- **Data stored:**
  - Message history (last 6 for OpenAI)
  - Media URLs (images/videos)
  - Extracted complaint data
  - Ward validation results

---

## Token Optimization

To keep OpenAI costs low:

1. **Only last 6 messages** sent to AI (not full history)
2. **Session stored in memory** (no DB reads)
3. **Minimal system prompts** (concise instructions)
4. **gpt-4o-mini model** (cheaper than GPT-4)
5. **Max 500 tokens** per response
6. **Auto-cleanup** of inactive sessions

Estimated cost: **~$0.001 per conversation** (10-15 messages)

---

## AI Capabilities

The AI assistant can:

✅ Understand complaints in natural language
✅ Ask relevant follow-up questions
✅ Categorize into 10 municipal categories
✅ Assess priority (low/medium/high)
✅ Generate clear titles and descriptions
✅ Acknowledge uploaded images/videos
✅ Recognize location/landmark mentions
✅ Confirm before creating complaint

---

## Differences: `/api/ai/chat` vs `/api/ai/complaints`

| Feature | `/api/ai/chat` | `/api/ai/complaints` |
|---------|---------------|---------------------|
| **Flow** | Multi-turn conversation | Single API call |
| **AI Role** | Asks questions, clarifies | Analyzes and creates |
| **Use Case** | Chatbot, WhatsApp integration | Form submission |
| **Session** | Required (session_id) | Stateless |
| **Location** | Can be provided later | Required upfront |
| **Ward Check** | Enforced strictly | Enforced strictly |
| **Cost** | Multiple OpenAI calls | One OpenAI call |
| **User Experience** | Interactive, guided | Quick, direct |

---

## Error Handling

**1. Ward mismatch:**
```json
{
  "error": "This location is in Ward 10...",
  "citizen_ward": {...},
  "location_ward": {...}
}
```

**2. No ward assigned:**
```json
{
  "error": "Your profile does not have a ward assigned..."
}
```

**3. Location too far:**
```json
{
  "error": "This location is 5200m from your ward center...",
  "distance_meters": 5200
}
```

**4. Category not found:**
AI will ask more questions to clarify the issue type.

**5. Session expired:**
Client should start a new session (don't send old session_id).

---

## Testing

**Test Scenario 1: Full conversation**
```bash
# Start
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer TOKEN" \
  -F "message=Road is broken"

# Continue with location
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer TOKEN" \
  -F "session_id=SESSION_ID" \
  -F "latitude=19.2328" \
  -F "longitude=73.0906" \
  -F "message=Near school, very dangerous"
```

**Test Scenario 2: Ward mismatch**
```bash
# Use location from different ward
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer TOKEN" \
  -F "message=Water issue" \
  -F "latitude=19.9999" \  # Different ward
  -F "longitude=72.8888"
```

**Expected:** Error with ward details

---

## Production Considerations

1. ⚠️ **Rotate OpenAI API key** (exposed in chat)
2. 🔒 **Add rate limiting** per user (prevent spam)
3. 📊 **Monitor session memory usage** (limit max sessions)
4. 🗄️ **Consider Redis** for session storage (multi-server support)
5. 🎯 **Add AI vision** for image analysis (GPT-4 Vision)
6. 🔁 **Add retry logic** for OpenAI failures
7. 📝 **Log conversations** for quality improvement
8. 🌍 **Support Hindi/regional languages** in AI responses

---

## API Integration Checklist

- [ ] Update mobile app to use `/api/ai/chat` for conversational flow
- [ ] Store `session_id` in app state for message continuity
- [ ] Get user's location before starting conversation
- [ ] Show AI responses as chat bubbles
- [ ] Handle ward validation errors gracefully
- [ ] Clear session after complaint created
- [ ] Add "Start New Complaint" button to reset session
- [ ] Test with images/videos from camera
- [ ] Test ward boundary validation
- [ ] Add loading indicators during AI processing

---

## Support

For issues or questions:
- Check session stats: `GET /api/ai/chat/stats`
- Review server logs for OpenAI errors
- Verify citizen's ward_id is set in profile
- Confirm ward centroids are populated in database
- Test with direct endpoint first: `/api/ai/complaints`
