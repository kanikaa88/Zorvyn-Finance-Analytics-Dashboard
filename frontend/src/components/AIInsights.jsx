function AIInsights({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="insights-section">
      <h2>💡 Financial Insights</h2>
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="insight-card"
            style={{ borderLeftColor: getColorForType(insight.type) }}
          >
            <div className="insight-icon" style={{ color: getColorForType(insight.type) }}>
              {getIconForType(insight.type)}
            </div>
            <div className="insight-message">{insight.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIInsights;
