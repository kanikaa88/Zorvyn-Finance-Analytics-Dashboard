# Finance Analytics Frontend

A clean, minimal React frontend for the Finance Analytics Dashboard backend.

## Tech Stack

- React 18 + Vite
- Axios for API calls
- Recharts for data visualization
- Pure CSS (no UI frameworks)

## Features

### Authentication
- Login page with JWT authentication
- Register page for new users
- Token stored in localStorage
- Auto-redirect on authentication

### Dashboard
1. **Summary Cards**
   - Total Income
   - Total Expenses
   - Net Balance

2. **Charts**
   - Pie chart for category breakdown
   - Line chart for monthly trends (last 6 months)

3. **Transactions Table**
   - Recent transactions (last 10)
   - Filters by type and category
   - Formatted dates and amounts

4. **Add Transaction Form**
   - Amount, type, category, date, notes
   - Real-time validation
   - Success feedback

## Setup

### Prerequisites
- Node.js 16+ installed
- Backend server running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on http://localhost:5173

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── SummaryCards.jsx
│   ├── CategoryChart.jsx
│   ├── TrendsChart.jsx
│   ├── RecordsTable.jsx
│   └── AddRecordForm.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/           # API services
│   └── api.js
├── App.jsx            # Main app component
├── App.css            # Global styles
└── main.jsx           # Entry point
```

## API Integration

The app connects to the following backend endpoints:

### Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me

### Records
- GET /api/v1/records
- POST /api/v1/records
- PATCH /api/v1/records/:id
- DELETE /api/v1/records/:id

### Analytics
- GET /api/v1/analytics/dashboard
- GET /api/v1/analytics/category-breakdown
- GET /api/v1/analytics/monthly-trends

## Usage

### 1. Register/Login
- Navigate to http://localhost:5173
- Register a new account or login with existing credentials
- Token is automatically stored in localStorage

### 2. View Dashboard
- See summary cards with total income, expenses, and balance
- View pie chart showing spending by category
- View line chart showing income vs expenses over time

### 3. Filter Transactions
- Use type dropdown to filter by income/expense
- Use category input to filter by specific category
- Filters update the table in real-time

### 4. Add Transaction
- Fill in the form at the bottom
- Select type (income/expense)
- Enter category, amount, date, and optional notes
- Click "Add Transaction"
- Dashboard updates automatically

### 5. Logout
- Click "Logout" button in header
- Token is removed from localStorage
- Redirected to login page

## Features Demonstrated

### State Management
- React hooks (useState, useEffect)
- Local state for forms and filters
- Token persistence in localStorage

### API Integration
- Axios interceptors for auth token
- Error handling with try-catch
- Loading states
- Success/error feedback

### Data Visualization
- Recharts for pie and line charts
- Responsive charts
- Formatted tooltips and legends

### User Experience
- Loading indicators
- Error messages
- Success feedback
- Empty states
- Responsive design

## Development

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Styling

- Pure CSS (no frameworks)
- Clean, minimal design
- Responsive layout
- Color-coded elements (green for income, red for expense)
- Card-based UI

## Error Handling

- API errors displayed to user
- 401 errors trigger logout
- Form validation
- Network error handling

## Security

- JWT token in localStorage
- Token sent in Authorization header
- Auto-logout on 401 responses
- No sensitive data in frontend

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- Backend must be running on port 5000
- CORS must be enabled on backend
- Token expires after 7 days (backend setting)
- Charts require data to display

## Troubleshooting

### CORS Errors
Ensure backend has CORS enabled:
```javascript
app.use(cors());
```

### API Connection Failed
- Check backend is running on port 5000
- Verify VITE_API_BASE_URL in .env
- Check browser console for errors

### Charts Not Showing
- Ensure you have transaction data
- Check browser console for errors
- Verify analytics endpoints are working

### Token Issues
- Clear localStorage and login again
- Check token expiration (7 days)
- Verify JWT_SECRET matches backend

## Future Enhancements

Potential improvements:
- Pagination for transactions table
- Date range picker for filtering
- Export data to CSV
- Dark mode
- Mobile responsive improvements
- Budget tracking UI
- Notifications
- Profile settings
