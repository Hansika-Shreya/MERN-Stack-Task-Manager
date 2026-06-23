const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.total}</h3>
        <p>Total Tasks</p>
      </div>
      <div className="stat-card">
        <h3 style={{ color: '#16a34a' }}>{stats.completed}</h3>
        <p>Completed</p>
      </div>
      <div className="stat-card">
        <h3 style={{ color: '#f59e0b' }}>{stats.pending}</h3>
        <p>Pending</p>
      </div>
      <div className="stat-card">
        <h3 style={{ color: '#dc2626' }}>{stats.overdue}</h3>
        <p>Overdue</p>
      </div>
    </div>
  );
};

export default StatsCards;