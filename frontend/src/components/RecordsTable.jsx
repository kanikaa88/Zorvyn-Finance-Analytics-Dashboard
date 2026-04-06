import { recordsAPI } from '../services/api';

function RecordsTable({ records, filters, onFilterChange }) {
  // All possible categories from seed data
  const categories = [
    'Salary',
    'Freelance', 
    'Investment',
    'Bonus',
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare'
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = async () => {
    try {
      const response = await recordsAPI.exportRecords(filters);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-records-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export records');
    }
  };

  return (
    <div className="records-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📊 Recent Transactions</h2>
        <button onClick={handleExport} className="export-btn">
          📥 Export CSV
        </button>
      </div>

      <div className="filters">
        <select name="type" value={filters.type} onChange={onFilterChange}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select name="category" value={filters.category} onChange={onFilterChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{formatDate(record.date)}</td>
                <td>
                  <span className={`type-badge ${record.type}`}>
                    {record.type}
                  </span>
                </td>
                <td>{record.category}</td>
                <td>{formatAmount(record.amount)}</td>
                <td>{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecordsTable;
