import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffc371', '#ff8b94', '#a8e6cf', '#ffd3b6', '#ffaaa5', '#b4e7ce'];

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h2>🎯 Category Distribution</h2>
        <div className="empty-state">No data available</div>
      </div>
    );
  }

  // Filter only expenses for pie chart
  const expenseData = data.filter(item => item.type === 'expense');

  if (expenseData.length === 0) {
    return (
      <div className="chart-card">
        <h2>🎯 Category Distribution</h2>
        <div className="empty-state">No expense data available</div>
      </div>
    );
  }

  const chartData = expenseData.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '13px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-card">
      <h2>🎯 Expense Distribution</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={110}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(20, 25, 45, 0.95)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              fontWeight: 600,
              color: '#fff'
            }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Amount']}
            labelStyle={{ color: '#4ecdc4', fontWeight: 700 }}
          />
          <Legend 
            wrapperStyle={{ 
              fontWeight: 600, 
              fontSize: 13,
              color: '#b8c5d6'
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
