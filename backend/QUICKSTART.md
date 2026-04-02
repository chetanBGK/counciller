# Quick Start Guide - Councillor App Backend

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- PostgreSQL running locally
- npm or yarn

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

### Step 2: Setup Database

```powershell
# Create database
createdb councillor_app

# Load schema (run in PostgreSQL)
psql -U postgres -d councillor_app -f ../table\ creation.sql
psql -U postgres -d councillor_app -f ../updated\ table\ v2.sql
```

### Step 3: Configure Environment

Copy and edit `.env`:

```powershell
copy .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=councillor_app
JWT_SECRET=supersecretkey123
```

### Step 4: Start the Server

```powershell
npm start
```

You should see:
```
🚀 Server listening on http://localhost:3000
❤️ Health check: http://localhost:3000/health
```

---

## 📝 Test the API

### 1. Send OTP (Public Endpoint)

```powershell
$body = @{
    phone = "+919876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/send-otp" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}
```

### 2. Verify OTP & Get Token

```powershell
$body = @{
    phone = "+919876543210"
    otp = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/verify-otp" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Save the token** from response's `data.token`

### 3. Get User Profile (Protected)

```powershell
$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/user/me" `
  -Method GET `
  -Headers $headers
```

---

## 🎯 Key API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify & login

### User
- `GET /api/user/me` - Get profile
- `PUT /api/user/update` - Update profile
- `GET /api/user/notifications` - Get notifications

### Complaints
- `POST /api/complaints/create` - Create complaint
- `GET /api/complaints/my` - Get my complaints
- `GET /api/complaints/:id` - Get complaint details

### Councillor (Role: councillor/councillor_admin)
- `GET /api/councillor/dashboard` - Dashboard
- `GET /api/councillor/complaints` - Get complaints
- `PUT /api/councillor/approve/:id` - Approve
- `PUT /api/councillor/complete/:id` - Complete

### Admin (Role: councillor_admin)
- `POST /api/admin/announcement` - Create announcement
- `POST /api/admin/category` - Create category
- `POST /api/admin/ward` - Create ward
- `POST /api/admin/create-admin-employee` - Create employee

### AI
- `POST /api/ai/process` - AI complaint analysis

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/       # Database config
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth & role middleware
│   ├── models/       # Database queries
│   ├── routes/       # Express routes
│   ├── services/     # Business logic
│   ├── utils/        # Helpers
│   ├── app.js        # Express setup
│   └── server.js     # Entry point
├── package.json
├── .env
├── .env.example
├── README.md
└── API_DOCUMENTATION.md
```

---

## 🔧 Development Tips

### Watch Mode (Auto-reload)
```powershell
npm run dev
```

### Database Queries
All SQL queries are in `src/models/` files:
- User operations → `user.model.js`
- Complaints → `complaint.model.js`
- Councillor → `councillor.model.js`

### Add New Endpoint

1. Create controller in `src/controllers/`
2. Create service in `src/services/` (optional)
3. Add route in `src/routes/`
4. Import route in `src/app.js`

Example:

```javascript
// controller
export const myAction = catchError(async (req, res) => {
  const data = await myService.doSomething();
  return successResponse(res, data, 'Success');
});

// route
router.get('/my-route', authMiddleware, myAction);
```

---

## 🛡️ Security

- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Password hashing with bcryptjs
- ✅ SQL injection prevention
- ✅ CORS enabled

---

## 📊 Roles

- **citizen** (default) - Can create complaints
- **councillor** - Can manage complaints
- **councillor_admin** - Full admin access

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Change PORT in .env
# Or find process using port
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Get-Process -Id $_ }
```

### Database Connection Error
```powershell
# Check PostgreSQL is running
# Verify credentials in .env
# Test connection with psql
psql -h localhost -U postgres -d councillor_app
```

### Missing Dependencies
```powershell
npm install
```

---

## 📚 Documentation

- **Full Docs**: See `API_DOCUMENTATION.md`
- **Project Overview**: See `README.md`

---

## ✅ Next Steps

1. ✅ Database setup
2. ✅ Environment config
3. ✅ Server running
4. ✅ API tested
5. 📌 Integrate with frontend
6. 📌 Deploy to production

---

**Need Help?** Check the API_DOCUMENTATION.md for detailed endpoint documentation.