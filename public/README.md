# Frontend Demo Page

A simple, single-page HTML application to interact with the Finance Analytics Backend API.

## Features

### 1. Authentication
- Register new user
- Login existing user
- Logout (clears JWT token)
- JWT token stored in localStorage
- Auth status indicator

### 2. Financial Records
- Create income/expense records
- View all records with filters:
  - Filter by type (income/expense)
  - Filter by category
  - Filter by amount range (min/max)
- Color-coded display (green for income, red for expense)

### 3. Budget Management
- Create budgets for categories
- View budget status with:
  - Budget amount vs actual spent
  - Percentage used
  - Status indicator (OK, WARNING, EXCEEDED)
- Color-coded status display

### 4. Dashboard
- View analytics summary
- Total income, expenses, and balance

## How to Use

### 1. Start the Backend Server
```bash
npm start
# or
npm run dev
```

The backend should be running on `http://localhost:5000`

### 2. Access the Frontend
Open your browser and navigate to:
```
http://localhost:5000
```

The index.html file is served automatically from the public directory.

### 3. Test the Application

#### Step 1: Register/Login
1. Enter name, email, and password
2. Click "Register" to create a new account
3. Or click "Login" if you already have an account
4. JWT token is automatically stored in localStorage
5. Auth status changes to "Logged In ✓"
6. Protected sections become visible

#### Step 2: Create Records
1. Enter amount, type, category, date, and notes
2. Click "Create Record"
3. Response shows the created record

#### Step 3: View Records
1. Optionally set filters (type, category, amount range)
2. Click "Get Records"
3. Records display in a grid layout
4. Click "Clear Filters" to reset

#### Step 4: Create Budget
1. Enter category, limit amount, month, and year
2. Click "Create Budget"
3. Response shows the created budget

#### Step 5: Check Budget Status
1. Set month and year (defaults to current)
2. Click "Get Budget Status"
3. View budget vs actual spending with status indicators

#### Step 6: View Dashboard
1. Click "Load Dashboard"
2. View summary of income, expenses, and balance

## API Endpoints Used

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/records` - Create financial record
- `GET /api/v1/records` - Get records with filters
- `POST /api/v1/budgets` - Create budget
- `GET /api/v1/budgets/status` - Get budget status
- `GET /api/v1/analytics/summary` - Get dashboard summary

## Features Demonstrated

### Authentication Flow
- JWT token management
- localStorage persistence
- Conditional UI rendering based on auth status

### API Integration
- fetch() API for HTTP requests
- Bearer token authentication
- Query parameter construction
- Error handling and display

### User Experience
- Color-coded responses (success/error)
- Clean layout with sections
- Form validation
- Auto-populated date fields
- Responsive grid layout

## Technical Details

### No External Dependencies
- Pure HTML, CSS, and JavaScript
- No frameworks (React, Vue, etc.)
- No build tools required
- No npm packages for frontend

### localStorage Usage
```javascript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Remove token
localStorage.removeItem('token');
```

### fetch() API Pattern
```javascript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

const result = await response.json();
```

## Styling

### Color Scheme
- Primary: #007bff (blue)
- Success: #28a745 (green)
- Warning: #ffc107 (yellow)
- Danger: #dc3545 (red)
- Secondary: #6c757d (gray)

### Status Indicators
- OK: Green border (< 70% budget used)
- WARNING: Yellow border (70-90% budget used)
- EXCEEDED: Red border (> 90% budget used)

### Record Types
- Income: Green border
- Expense: Red border

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript (async/await, arrow functions)
- fetch() API
- localStorage
- CSS Grid

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure the backend has CORS enabled:
```javascript
app.use(cors());
```

### Token Not Persisting
Check browser console for localStorage errors. Some browsers block localStorage in private/incognito mode.

### API Not Responding
1. Verify backend is running on port 5000
2. Check the API_BASE constant in index.html matches your backend URL
3. Check browser console for network errors

### Rate Limiting
If you hit rate limits:
- Auth endpoints: 5 requests/minute
- Global: 100 requests/15 minutes
- Wait for the timeout period to reset

## Customization

### Change API URL
Edit the `API_BASE` constant in index.html:
```javascript
const API_BASE = 'http://your-api-url.com/api/v1';
```

### Add More Features
The code is structured to easily add more sections:
1. Add HTML section
2. Add corresponding JavaScript function
3. Use the same fetch() pattern

### Styling
All styles are in the `<style>` tag. Modify colors, spacing, or layout as needed.

## Security Notes

- JWT tokens stored in localStorage (vulnerable to XSS)
- For production, consider httpOnly cookies
- Always use HTTPS in production
- Validate all user inputs
- Never expose sensitive data in responses

## Next Steps

For a production application, consider:
- Using a frontend framework (React, Vue, Angular)
- Implementing proper state management
- Adding form validation
- Using httpOnly cookies for tokens
- Adding loading indicators
- Implementing pagination
- Adding confirmation dialogs
- Better error handling
- Responsive mobile design
