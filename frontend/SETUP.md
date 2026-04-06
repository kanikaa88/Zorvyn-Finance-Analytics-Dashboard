# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

## Step 2: Configure Environment

The `.env` file is already created with:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

If your backend runs on a different port, update this file.

## Step 3: Start Backend

In a separate terminal, start your backend server:
```bash
cd ..
npm start
```

Backend should be running on http://localhost:5000

## Step 4: Start Frontend

```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Register" to create a new account
3. Fill in name, email, and password
4. After registration, you'll be redirected to login
5. Login with your credentials
6. You'll see the dashboard with:
   - Summary cards (will show $0 initially)
   - Empty charts
   - Empty transactions table
   - Add transaction form

## Step 6: Add Some Data

1. Scroll to "Add New Transaction" form
2. Add a few transactions:
   - Income: Salary, $5000
   - Expense: Rent, $1500
   - Expense: Food, $500
   - Expense: Transport, $200
3. Dashboard will update automatically with:
   - Updated summary cards
   - Pie chart showing category breakdown
   - Line chart showing trends
   - Transactions in the table

## Step 7: Test Filters

1. Use the type dropdown to filter by income/expense
2. Type a category name to filter by category
3. Table updates in real-time

## Troubleshooting

### Backend Not Running
```
Error: Network Error
```
Solution: Start the backend server first

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
Solution: Ensure backend has CORS enabled (it should be by default)

### Port Already in Use
```
Port 5173 is already in use
```
Solution: Kill the process or Vite will suggest another port

### Token Expired
```
401 Unauthorized
```
Solution: Logout and login again (token expires after 7 days)

## Default Test Account

You can create a test account with:
- Name: Test User
- Email: test@example.com
- Password: test123

## Features to Test

- [x] Register new user
- [x] Login with credentials
- [x] View empty dashboard
- [x] Add income transaction
- [x] Add expense transaction
- [x] View updated summary cards
- [x] View pie chart
- [x] View line chart
- [x] Filter by type
- [x] Filter by category
- [x] Logout

## Next Steps

Once everything is working:
1. Add more transactions to see better charts
2. Try different categories
3. Test filters
4. Check responsive design on mobile

Enjoy your Finance Analytics Dashboard! 🎉
