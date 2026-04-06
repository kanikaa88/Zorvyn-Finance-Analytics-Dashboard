import { useState, useEffect } from 'react';
import { recordsAPI, analyticsAPI } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import CategoryChart from '../components/CategoryChart';
import TrendsChart from '../components/TrendsChart';
import ExpenseBreakdownChart from '../components/ExpenseBreakdownChart';
import RecordsTable from '../components/RecordsTable';
import AddRecordForm from '../components/AddRecordForm';
import AIInsights from '../components/AIInsights';

function Dashboard({ onLogout }) {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [records, setRecords] = useState([]);
  const [insights, setInsights] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // Build clean params (don't send empty strings)
      const recordParams = { limit: 10 };
      if (filters.type) recordParams.type = filters.type;
      if (filters.category) recordParams.category = filters.category;

      // Fetch data - some endpoints might fail for viewer role
      const results = await Promise.allSettled([
        analyticsAPI.getDashboard(),
        analyticsAPI.getCategoryBreakdown(),
        analyticsAPI.getMonthlyTrends(),
        recordsAPI.getRecords(recordParams),
        analyticsAPI.getAIInsights(),
      ]);

      // Handle successful responses
      if (results[0].status === 'fulfilled') {
        setSummary(results[0].value.data.data);
      }
      if (results[1].status === 'fulfilled') {
        setCategoryData(results[1].value.data.data.breakdown || []);
      }
      if (results[2].status === 'fulfilled') {
        setTrendsData(results[2].value.data.data.trends || []);
      }
      if (results[3].status === 'fulfilled') {
        setRecords(results[3].value.data.data.records || []);
      }
      if (results[4].status === 'fulfilled') {
        setInsights(results[4].value.data.data.insights || []);
      } else {
        // Financial Insights failed (likely insufficient permissions for viewer)
        setInsights([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAdded = () => {
    fetchData();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading && !summary) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Finance Dashboard</h1>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Finance Dashboard</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        <SummaryCards summary={summary} />

        <AIInsights insights={insights} />

        <div className="charts-section">
          <CategoryChart data={categoryData} />
          <TrendsChart data={trendsData} />
        </div>

        <div className="charts-section">
          <ExpenseBreakdownChart data={categoryData} />
        </div>

        <RecordsTable
          records={records}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <AddRecordForm onRecordAdded={handleRecordAdded} />
      </div>
    </div>
  );
}

export default Dashboard;
