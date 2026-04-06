import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

function TrendsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h2>📈 Monthly Trends</h2>
        <div className="empty-state">No data available</div>
      </div>
    );
  }

  // Format data for display
  const formattedData = data.map(item => ({
    ...item,
    monthLabel: `${item.month}/${item.year}`,
  }));

  return (
    <div className="chart-card">
      <h2>📈 Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="monthLabel" 
            tick={{ fill: '#8a9ab0', fontSize: 12, fontWeight: 600 }}
            stroke="rgba(255, 255, 255, 0.2)"
          />
          <YAxis 
            tick={{ fill: '#8a9ab0', fontSize: 12, fontWeight: 600 }}
            stroke="rgba(255, 255, 255, 0.2)"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(20, 25, 45, 0.95)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              fontWeight: 600,
              color: '#fff'
            }}
            formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            labelStyle={{ color: '#4ecdc4', fontWeight: 700 }}
          />
          <Legend 
            wrapperStyle={{ fontWeight: 600, fontSize: 13, color: '#b8c5d6' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#4ecdc4"
            strokeWidth={3}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ff6b6b"
            strokeWidth={3}
            fill="url(#colorExpense)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendsChart;
