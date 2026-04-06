# Finance Analytics Dashboard

A full-stack finance analytics application with Node.js, Express, MongoDB, and React. Features JWT authentication, role-based access control, automated testing, and real-time analytics.

## Quick Start

```bash
# Install dependencies
npm install && cd frontend && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env if using MongoDB Atlas

# Seed database with demo data
npm run seed

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

Open http://localhost:5173 and login with demo credentials.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| Analyst | analyst@demo.com | analyst123 |
| Viewer | viewer@demo.com | viewer123 |

## Features

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Role-based access control (RBAC)
- Rate limiting
- Input validation
- Soft deletes
- MongoDB aggregation pipelines for analytics

### Frontend
- React with Vite
- Interactive charts (Chart.js)
- Real-time dashboard
- Responsive design
- One-click demo login

### Security
- JWT authentication with 7-day expiration
- Password hashing with bcrypt
- User data isolation
- Permission-based authorization
- Rate limiting (50 req/min dev, 5 req/min prod)
- Input validation on all endpoints

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register    # Register new user
POST   /api/v1/auth/login       # Login user
GET    /api/v1/auth/me          # Get current user
```

### Financial Records
```
GET    /api/v1/records          # Get all records (with filters)
POST   /api/v1/records          # Create record
GET    /api/v1/records/:id      # Get single record
PATCH  /api/v1/records/:id      # Update record
DELETE /api/v1/records/:id      # Delete record
GET    /api/v1/records/export   # Export to CSV
```

### Analytics
```
GET    /api/v1/analytics/dashboard              # Summary stats
GET    /api/v1/analytics/category-breakdown     # By category
GET    /api/v1/analytics/monthly-trends         # 6-month trends
GET    /api/v1/analytics/insights/summary       # Financial insights
```

### Budgets
```
GET    /api/v1/budgets          # Get all budgets
POST   /api/v1/budgets          # Create budget
GET    /api/v1/budgets/status   # Budget status
PUT    /api/v1/budgets/:id      # Update budget
DELETE /api/v1/budgets/:id      # Delete budget
```

## Testing

### Automated Tests

```bash
npm test
```

37 comprehensive tests covering:
- Rate limiting (auth and global endpoints)
- Error handling (401, 400, 404, 429)
- Security (JWT, password hashing, user isolation)
- RBAC (all role permissions)
- Budget and record management

Expected: 37 tests pass, 100% pass rate

See `AUTOMATED_TESTING.md` for detailed documentation.

### Manual Testing

Comprehensive manual testing performed with Postman. See `POSTMAN_TESTS.md` for 60+ test cases covering all endpoints and RBAC verification.

## Permission Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Create Record | ❌ | ✅ | ✅ |
| Read Records | ✅ | ✅ | ✅ |
| Update Record | ❌ | ✅ | ✅ |
| Delete Record | ❌ | ❌ | ✅ |
| View Analytics | ✅ | ✅ | ✅ |
| View Insights | ❌ | ✅ | ✅ |
| Create Budget | ❌ | ✅ | ✅ |
| Delete Budget | ❌ | ❌ | ✅ |

## Project Structure

```
├── src/
│   ├── config/          # Configuration (database, roles)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, RBAC, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── validators/      # Input validation
├── tests/
│   └── automated-api-tests.js    # Automated test suite
├── frontend/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── services/    # API client
└── seed.js              # Database seeding script
```

## Technology Stack

**Backend:**
- Node.js v18+
- Express.js v4.18
- MongoDB v6+
- Mongoose v8
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- express-rate-limit

**Frontend:**
- React v18
- Vite
- Chart.js
- Axios

**Testing:**
- Custom test suite with Axios
- 37 automated tests
- Manual testing with Postman

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-analytics
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Architecture Decisions

### Service Layer Pattern
Business logic is separated into service classes, making the code more maintainable and testable. Controllers handle HTTP concerns while services handle business logic.

### Centralized RBAC
All roles and permissions are defined in `src/config/roles.js`, making it easy to add new roles or modify permissions without touching business logic.

### MongoDB Aggregation Pipelines
Analytics queries use MongoDB's aggregation framework for efficient server-side processing, reducing data transfer and improving performance.

### Soft Deletes
Records are marked as deleted rather than permanently removed, allowing for data recovery and maintaining audit trails.

### User Data Isolation
Every query filters by userId, ensuring users can only access their own data. This is enforced at the service layer.

## Documentation

- `README.md` - Complete project documentation
- `QUICK_START.md` - Quick setup guide
- `AUTOMATED_TESTING.md` - Automated test documentation
- `POSTMAN_TESTS.md` - Manual testing guide
- `SECURITY.md` - Security implementation details
- `SUBMISSION.md` - Submission summary
- `tests/README.md` - Test suite documentation
- `tests/TEST_RESULTS.md` - Actual test results

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Seed database
npm run seed

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or managed MongoDB
4. Configure CORS for your domain
5. Enable HTTPS
6. Review rate limits for your use case

## License

MIT

---

Built for Zorvyn Backend Internship Assignment
