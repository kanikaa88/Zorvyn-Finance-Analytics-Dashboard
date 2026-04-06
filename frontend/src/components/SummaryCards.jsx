function SummaryCards({ summary }) {
  if (!summary) return null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="summary-cards">
      <div className="card income">
        <h3>Total Income</h3>
        <div className="amount">{formatAmount(summary.totalIncome)}</div>
      </div>
      <div className="card expense">
        <h3>Total Expenses</h3>
        <div className="amount">{formatAmount(summary.totalExpenses)}</div>
      </div>
      <div className="card">
        <h3>Net Balance</h3>
        <div className="amount">{formatAmount(summary.netBalance)}</div>
      </div>
    </div>
  );
}

export default SummaryCards;
