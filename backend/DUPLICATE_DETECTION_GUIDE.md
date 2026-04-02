# Duplicate Complaint Detection & Merging System

## Overview
The system now automatically detects and merges duplicate complaints based on location proximity, category, and content similarity using AI and geospatial analysis.

## How It Works

### 1. **Automatic Detection on Submission**
When a new complaint is submitted, the system:
- Checks for similar complaints within **500m radius** (configurable)
- Looks back **48 hours** (configurable)
- Analyzes same **category** complaints
- Calculates **similarity score** (0-100%) based on:
  - **Location proximity** (40% weight)
  - **Category match** (30% weight)
  - **Text similarity** (30% weight)

### 2. **Auto-Merge Threshold**
- Complaints with **≥85% similarity** are automatically merged
- The original complaint becomes the "parent"
- The new complaint is marked as a duplicate
- Reporter info is added to the merged list

### 3. **Tracking Multiple Reports**
Each parent complaint tracks:
- **`duplicate_count`**: Number of citizens reporting the same issue
- **`merged_reporters`**: Array of all reporters with their complaint IDs
- **`is_duplicate`**: Flag indicating if this is a duplicate
- **`parent_complaint_id`**: Links duplicate to parent complaint

## Database Schema Changes

Run this migration:
```bash
psql -d your_database -f backend/database/add_duplicate_tracking.sql
```

### New Fields in `complaints` table:
- `parent_complaint_id` - Links to main complaint if duplicate
- `duplicate_count` - Number of merged reports (on parent only)
- `merged_reporters` - JSONB array of all reporter details
- `is_duplicate` - Boolean flag
- `similarity_score` - 0-100 score indicating similarity

## API Endpoints

### 1. Get Similar Complaints
```http
GET /api/complaints/:id/similar
Authorization: Bearer <token>

Query Parameters:
- radius: Distance in meters (default: 500)
- hours: Time window in hours (default: 48)
- minScore: Minimum similarity % (default: 60)
- limit: Max results (default: 10)

Response:
{
  "success": true,
  "data": {
    "complaint_id": 123,
    "similar_count": 3,
    "similar_complaints": [
      {
        "id": 456,
        "title": "Streetlight broken",
        "similarity_score": 92,
        "distance_meters": 150,
        "distance_formatted": "150m",
        "created_at": "2026-01-30T10:00:00Z",
        "reporter_name": "John Doe",
        "duplicate_count": 2
      }
    ]
  }
}
```

### 2. Merge Complaints
```http
POST /api/complaints/:id/merge
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "parent_complaint_id": 456,
  "similarity_score": 92  // optional
}

Response:
{
  "success": true,
  "message": "Complaints merged successfully",
  "data": {
    "success": true,
    "parent_id": 456,
    "duplicate_id": 123,
    "total_reports": 3
  }
}
```

**Permissions**: Only `admin` or `councillor` (for their ward) can merge

### 3. Unmerge Complaint
```http
POST /api/complaints/:id/unmerge
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Complaint unlinked successfully",
  "data": {
    "success": true,
    "unlinked_id": 123
  }
}
```

**Permissions**: Only `admin` can unmerge

### 4. Get Grouped Complaints
```http
GET /api/complaints/grouped
Authorization: Bearer <token>

Query Parameters:
- ward_id: Filter by ward
- category_id: Filter by category
- status: Filter by status
- limit: Max results (default: 20)
- offset: Pagination offset (default: 0)

Response:
{
  "success": true,
  "data": [
    {
      "id": 456,
      "title": "Streetlight not working",
      "duplicate_count_actual": 2,
      "merged_reporters": [...],
      "duplicates": [
        {
          "id": 457,
          "user_id": 789,
          "title": "Street light broken",
          "created_at": "2026-01-30T11:00:00Z",
          "reporter_name": "Jane Smith",
          "similarity_score": 88
        }
      ],
      ...
    }
  ]
}
```

### 5. Get Duplicate Statistics
```http
GET /api/complaints/duplicates/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "total_duplicates": 45,
    "complaints_with_duplicates": 23,
    "total_merged": 67,
    "avg_similarity": "87.3",
    "categories_affected": 5
  }
}
```

**Permissions**: `admin` or `councillor` only

## Usage Examples

### Example 1: Automatic Detection
```javascript
// When citizen submits complaint
POST /api/complaints
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing accidents",
  "category_id": 3,
  "location": [19.2183, 73.0978],
  "landmark": "Near City Hall"
}

// Response includes duplicate detection
{
  "success": true,
  "data": {
    "id": 789,
    "title": "Pothole on Main Street",
    ...
    "duplicate_detection": {
      "action": "auto_linked",
      "parent_complaint_id": 456,
      "similarity_score": 92,
      "similar": [...]
    }
  }
}
```

### Example 2: Manual Check Before Merge
```javascript
// 1. Get similar complaints
GET /api/complaints/789/similar

// 2. Review suggestions
// 3. Merge manually if needed
POST /api/complaints/789/merge
{
  "parent_complaint_id": 456
}
```

### Example 3: Dashboard View
```javascript
// Councillor dashboard showing grouped complaints
GET /api/complaints/grouped?ward_id=5&status=submitted

// Shows each unique issue with count of how many citizens reported it
```

## Configuration Options

In `complaint.service.js`, adjust these parameters:

```javascript
await duplicateDetectionService.detectAndLinkDuplicate(complaint, {
  radiusMeters: 500,         // Search within 500m
  hoursThreshold: 48,        // Look back 48 hours
  minSimilarityScore: 60,    // Show suggestions ≥60%
  autoMergeThreshold: 85,    // Auto-merge at ≥85%
});
```

## Benefits

1. **Reduces Duplicate Work**: Councillors see one issue instead of 50 separate complaints
2. **Shows Impact**: Clear count of how many citizens are affected
3. **Better Prioritization**: Issues with more reports get higher visibility
4. **Combined Evidence**: All photos/details from multiple reports in one place
5. **Citizen Transparency**: Each citizen still has their own complaint record

## Frontend Integration

### Display Merged Complaints
```javascript
// Show on complaint detail page
if (complaint.duplicate_count > 0) {
  // Show badge: "3 citizens reported this issue"
}

if (complaint.is_duplicate) {
  // Show link: "This is part of complaint #456"
}
```

### Show Similar Warnings
```javascript
// Before submission, check for similar
const similar = await fetch(`/api/complaints/${newId}/similar`);
if (similar.data.similar_count > 0) {
  // Show warning: "Similar complaints found. Do you want to merge?"
}
```

## Notes

- **Privacy**: All reporters' info is preserved in `merged_reporters` array
- **Status**: When parent is resolved, all duplicates should be notified
- **Performance**: Spatial indexes ensure fast proximity searches
- **Flexibility**: Can unmerge if incorrectly linked

## Testing

1. **Run Migration**:
```bash
psql -d your_database -f backend/database/add_duplicate_tracking.sql
```

2. **Test Auto-Detection**:
- Submit complaint with location
- Submit another similar complaint nearby
- Check if auto-merged (≥85% similarity)

3. **Test Manual Merge**:
- Submit complaints with lower similarity (60-84%)
- Use merge endpoint to link manually
- Verify counts updated correctly

## Future Enhancements

1. **AI-Enhanced Similarity**: Use GPT/Claude for semantic similarity
2. **Image Comparison**: Compare uploaded photos
3. **Push Notifications**: Alert citizens when their duplicate is resolved
4. **Bulk Operations**: Merge multiple complaints at once
5. **Analytics Dashboard**: Show duplicate trends by area/category
