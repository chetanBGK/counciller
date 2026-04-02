# Councillor App Backend

A production-grade Node.js + Express + PostgreSQL backend for the Councillor App - a civic engagement platform for complaint management and citizen-councillor interaction.

## Features

✅ **User Management** - Citizen registration and profile management  
✅ **OTP Authentication** - Secure phone-based login  
✅ **Complaint Management** - Full CRUD operations for civic complaints  
✅ **Councillor Dashboard** - Complaint tracking and status updates  
✅ **Admin Panel** - Category, ward, and employee management  
✅ **AI Integration** - OpenAI-powered complaint analysis  
✅ **Notifications** - Real-time user notifications  
✅ **Role-Based Access Control** - citizen, councillor, councillor_admin  
✅ **Audit Logging** - Complete action history  

## Tech Stack
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT
- **AI**: OpenAI API
- **File Upload**: Multer
- **Security**: bcryptjs, helmet, CORS

## Prerequisites

- Node.js v16+
- PostgreSQL 12+
- npm or yarn
- OpenAI API key (optional, for AI features)

## Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# 4. Set up database
# Run the SQL files in your PostgreSQL:
psql -U postgres -d councillor_app -f ../table\ creation.sql
psql -U postgres -d councillor_app -f ../updated\ table\ v2.sql

# 5. Start server
npm start
```

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=councillor_app

JWT_SECRET=your_super_secret_key
JWT_EXPIRY=7d

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
```

### MSG91 SMS template setup

1. In the MSG91 Dashboard, create a Flow (or Template) for SMS using the variables below.
2. Note the `template_id` and set it in your environment as `MSG91_TEMPLATE_ID` or set `MSG91_TEMPLATE_COUNCILLOR_CREATE` to override for councillor onboarding messages.

Suggested template variables: `NAME`, `WARD`, `MOBILE`, `APP_URL`, `SUPPORT_PHONE`.

Example (long):

Hello {{NAME}}, you have been appointed Councillor for Ward {{WARD}}. Your account is active. Login with your mobile number {{MOBILE}} and set your password here: {{APP_URL}}/set-password. For help contact {{SUPPORT_PHONE}}.

Short SMS example:

Welcome {{NAME}} — Councillor, Ward {{WARD}}. Login: {{APP_URL}}. Support: {{SUPPORT_PHONE}}.

After creating the template, update your `.env` with `MSG91_TEMPLATE_ID` or `MSG91_TEMPLATE_COUNCILLOR_CREATE`, and ensure `MSG91_AUTH_KEY` is set.


## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL Pool configuration
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── complaint.controller.js
│   │   ├── councillor.controller.js
│   │   ├── admin.controller.js
│   │   ├── ai.controller.js
│   │   └── notification.controller.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/                # Database query functions
│   │   ├── user.model.js
│   │   ├── complaint.model.js
│   │   ├── councillor.model.js
│   │   ├── admin.model.js
│   │   ├── notification.model.js
│   │   ├── attachments.model.js
│   │   └── audit.model.js
│   ├── routes/                # Express routers
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── complaint.routes.js
│   │   ├── councillor.routes.js
│   │   ├── admin.routes.js
│   │   ├── ai.routes.js
│   │   └── notification.routes.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── complaint.service.js
│   │   ├── councillor.service.js
│   │   ├── admin.service.js
│   │   ├── ai.service.js
│   │   └── notification.service.js
│   ├── utils/                 # Utility functions
│   │   ├── response.js        # Response formatter
│   │   └── logger.js          # Logging utility
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── package.json
├── .env
└── README.md
```

## API Endpoints

### Authentication

```
POST /api/auth/send-otp
- Send OTP to phone number
- Body: { phone: "+919876543210" }

POST /api/auth/verify-otp
- Verify OTP and get JWT token
- Body: { phone: "+919876543210", otp: "123456" }
- Response: { token, user }
```

### User Management

```
GET /api/user/me
- Get current user profile
- Headers: Authorization: Bearer <token>

PUT /api/user/update
- Update user profile
- Body: { name, email, phone, address, etc. }

PUT /api/user/location
- Update user location
- Body: { address_line1, city, state, pincode, latitude, longitude }

GET /api/user/notifications
- Get user notifications (paginated)
- Query: limit, offset

GET /api/user/search?q=<search_term>
- Search for users
```

### Complaints (Citizens)

```
POST /api/complaints/create
- Create new complaint
- Body: { title, description, category_id, ward_id, priority, address_line1, city, state, pincode }

GET /api/complaints/my
- Get user's complaints (paginated)

GET /api/complaints/:id
- Get complaint details with history

PUT /api/complaints/confirm/:id
- Confirm complaint submission

POST /api/complaints/note/:id
- Add note to complaint
- Body: { note: "..." }

GET /api/complaints/history/:id
- Get complaint update history
```

### Councillor Dashboard

```
GET /api/councillor/dashboard
- Get dashboard stats (new, in-progress, closed counts)

GET /api/councillor/complaints
- Get councillor's complaints
- Query: status, limit, offset

PUT /api/councillor/approve/:id
- Approve complaint

PUT /api/councillor/in-progress/:id
- Mark complaint as in-progress

PUT /api/councillor/complete/:id
- Complete complaint
- Body: { resolution_notes: "..." }

POST /api/councillor/note/:id
- Add councillor note
- Body: { note: "..." }
```

### Admin Panel

```
POST /api/admin/announcement
- Create announcement
- Body: { title, description, image_url, target_role }

GET /api/admin/announcements
- Get announcements

POST /api/admin/category
- Create complaint category
- Body: { name: "..." }

POST /api/admin/ward
- Create ward
- Body: { name, number, population, area_sq_km, office_address, contact_number }

POST /api/admin/create-admin-employee
- Create councillor or admin
- Body: { phone, name, ward_id, role: "councillor|councillor_admin" }

GET /api/admin/employees
- Get all employees/councillors

GET /api/admin/dashboard-stats
- Get admin dashboard statistics
```

### AI Integration

```
POST /api/ai/process
- Process complaint with AI
- Body: { title: "...", description: "..." }
- Returns: { summary, category, priority, address }

POST /api/ai/extract-addresses
- Extract address from text
- Body: { text: "..." }

POST /api/ai/generate-summary
- Generate AI summary
- Body: { text: "...", max_length: 100 }
```

### Notifications

```
GET /api/notifications
- Get user notifications

PUT /api/notifications/read/:id
- Mark notification as read

PUT /api/notifications/read-all
- Mark all notifications as read

GET /api/notifications/unread-count
- Get unread notification count

DELETE /api/notifications/:id
- Delete notification
```

## Response Format

All responses follow a standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Authentication

The API uses JWT tokens for authentication. Include token in all protected requests:

```
Authorization: Bearer <token>
```

### Roles

- `citizen` - Regular user (default)
- `councillor` - Councillor with complaint handling abilities
- `councillor_admin` - Admin with full management access

## Database Queries

Models are organized by entity with SQL queries:

- **User Model** - User CRUD, search, profile
- **Complaint Model** - Complaint CRUD, status management, filtering
- **Councillor Model** - Councillor-specific queries and metrics
- **Admin Model** - Admin operations (announcements, categories, wards)
- **Notification Model** - Notification management
- **Audit Model** - Action logging

## Error Handling

All controllers use `catchError` wrapper for consistent error handling:

```javascript
export const myController = catchError(async (req, res) => {
  // Your logic here
  // Errors are automatically caught and formatted
});
```

## Audit Logging

All significant operations are logged:

```javascript
await auditModel.log(userId, 'ACTION_NAME', 'entity_type', entityId, ipAddress);
```

## Development

```bash
# Start with watch mode
npm run dev

# Health check
curl http://localhost:3000/health
```

## Production Deployment

1. Update `.env` with production values
2. Use environment: `NODE_ENV=production`
3. Use a process manager (PM2, Supervisor)
4. Set up database backups
5. Configure SSL/TLS
6. Use environment variables for all secrets

```bash
# Example with PM2
pm2 start src/server.js --name "councillor-backend"
pm2 save
```

## Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ Role-based access control
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ Input validation recommended

## Contributing

1. Follow existing code structure
2. Use consistent naming conventions
3. Add error handling with catchError
4. Log audit actions
5. Test before committing

## License

© 2024 Councillor App. All rights reserved.

## Support

For issues and questions, contact: support@councillor-app.local
