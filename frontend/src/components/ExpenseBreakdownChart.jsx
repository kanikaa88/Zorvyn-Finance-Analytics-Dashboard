import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function ExpenseBreakdownChart({ data }) {
  // Filter only expenses
  const expenseData = data.filter(item => item.type === 'expense');

  // Sort by total descending
  const sortedData = [...expenseData].sort((a, b) => b.total - a.total);

  // Color palette for bars
  const colors = ['#ff6b6b', '#4ecdc4', '#ffc371', '#ff8b94', '#a8e6cf', '#ffd3b6'];

  if (sortedData.length === 0) {
    return (
      <div className="chart-card">
        <h2>💸 Expense Breakdown</h2>
        <div className="empty-state">No expense data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h2>💸 Top Spending Categories</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="category" 
            tick={{ fill: '#8a9ab0', fontSize: 12, fontWeight: 600 }}
            angle={-15}
            textAnchor="end"
            height={80}
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
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Legend 
            wrapperStyle={{ fontWeight: 600, fontSize: 13, color: '#b8c5d6' }}
            iconType="circle"
          />
          <Bar 
            dataKey="total" 
            name="Total Spent"
            radius={[12, 12, 0, 0]}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient${index % colors.length})`}
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseBreakdownChart;
