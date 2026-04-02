# Officer-Category Mapping System

## Overview
This system allows councillors and ward admins to assign specific complaint categories to officers in their ward. Each ward can have different categories, and officers are mapped to handle specific categories.

## How It Works

### Database Structure
- **officer_categories table**: Maps officers to categories within wards
  - `officer_id`: The officer handling the category
  - `category_id`: The category being handled
  - `ward_id`: The ward this mapping belongs to
  - Unique constraint ensures one officer can't be assigned the same category twice in the same ward

### API Endpoints

#### 1. Get Officers by Category
**GET** `/admin/categories/:categoryId/officers`
- Returns all officers assigned to handle a specific category across all wards
- Available to: All authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 5,
    "officers": [
      {
        "officer_id": 123,
        "officer_name": "John Doe",
        "phone_number": "9876543210",
        "role": "officer",
        "ward_name": "Ward 45",
        "ward_id": 10
      }
    ]
  }
}
```

#### 2. Assign Category to Officer
**POST** `/admin/officers/assign-category`
- Assigns a category to an officer in a ward
- Available to: Councillors, Ward Admins

**Request Body:**
```json
{
  "officer_id": 123,
  "category_id": 5,
  "ward_id": 10
}
```

**Validation:**
- Officer must exist and have role 'officer'
- Officer must belong to the specified ward
- Category and ward must exist

#### 3. Remove Category from Officer
**DELETE** `/admin/officers/remove-category`
- Removes a category assignment from an officer
- Available to: Councillors, Ward Admins

**Request Body:**
```json
{
  "officer_id": 123,
  "category_id": 5,
  "ward_id": 10
}
```

#### 4. Get Officer's Categories
**GET** `/admin/officers/:officerId/categories`
- Returns all categories assigned to a specific officer
- Available to: All authenticated users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 5,
      "category_name": "Water Supply",
      "phone_number": "1800-XXX-XXX",
      "ward_name": "Ward 45"
    }
  ]
}
```

## Workflow Example

### For Councillor/Ward Admin:

1. **Get list of officers in your ward**
   ```
   GET /admin/officers
   ```

2. **Get list of all categories**
   ```
   GET /admin/category
   ```

3. **Assign category to officer**
   ```
   POST /admin/officers/assign-category
   Body: { "officer_id": 123, "category_id": 5, "ward_id": 10 }
   ```

4. **View which officers handle which categories**
   ```
   GET /admin/categories/5/officers
   ```

5. **View all categories assigned to an officer**
   ```
   GET /admin/officers/123/categories
   ```

### For Citizens:
When a citizen creates a complaint with a category, the system can:
- Look up which officer handles that category in their ward
- Auto-assign or recommend the appropriate officer
- Show contact information for the category-specific officer

## Benefits
- **Ward-specific**: Each ward manages its own category-officer mappings
- **Flexible**: Officers can handle multiple categories
- **Multiple officers**: Multiple officers can handle the same category in different wards
- **Transparent**: Easy to see who handles what
- **Efficient routing**: Complaints can be automatically routed to the right officer


