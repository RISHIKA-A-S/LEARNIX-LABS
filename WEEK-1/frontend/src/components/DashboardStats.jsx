function DashboardStats({ tasks }) {

  const total = tasks.length;

  const completed =
    tasks.filter(
      task => task.status === "Completed"
    ).length;

  const progress =
    tasks.filter(
      task => task.status === "In Progress"
    ).length;

  return (
    <div className="stats">

      <div className="card">
        <h2>{total}</h2>
        <p>Total Tasks</p>
      </div>

      <div className="card">
        <h2>{completed}</h2>
        <p>Completed</p>
      </div>

      <div className="card">
        <h2>{progress}</h2>
        <p>In Progress</p>
      </div>

    </div>
  );
}

export default DashboardStats;