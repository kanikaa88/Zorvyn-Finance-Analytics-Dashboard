# Quick Start Guide

Get the Finance Analytics Dashboard running in under 2 minutes.

## Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)

## Installation

```bash
# 1. Install dependencies
npm install && cd frontend && npm install && cd ..

# 2. Setup environment
cp .env.example .env
# Edit .env if using MongoDB Atlas

# 3. Seed database
npm run seed
```

## Running the Application

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

Open http://localhost:5173

## Demo Accounts

Click any demo account on the login page:

- **Admin**: admin@demo.com / admin123
- **Analyst**: analyst@demo.com / analyst123
- **Viewer**: viewer@demo.com / viewer123

Each account has 6 months of sample financial data.

## Running Tests

```bash
# Make sure backend is running first
npm run dev

# In another terminal
npm test
```

Expected: 37 tests pass in ~1-2 seconds.

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running locally, or
- Update `MONGODB_URI` in `.env` to use MongoDB Atlas

**Port 5000 already in use:**
- Change `PORT` in `.env` to another port (e.g., 5001)

**Tests failing:**
- Restart backend: `npm run dev`
- Re-seed database: `npm run seed`
- Run tests again: `npm test`

## Next Steps

- See `README.md` for complete documentation
- See `AUTOMATED_TESTING.md` for test details
- See `POSTMAN_TESTS.md` for manual testing guide
