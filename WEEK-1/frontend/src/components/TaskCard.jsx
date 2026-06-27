function TaskCard({ task, onStatusChange, onDelete }) {
  const taskId = task._id || task.id;
  const priorityClass = (task.priority || "Medium").toLowerCase();

  return (
    <div className="task-card">
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <button className="delete-btn" onClick={() => onDelete(taskId)}>
          Delete
        </button>
      </div>

      <p>{task.description || "No description yet."}</p>

      <div className="task-footer">
        <div className="task-meta">
          <span className={`priority ${priorityClass}`}>{task.priority || "Medium"}</span>
          <span className="date">📅 {task.dueDate || "No due date"}</span>
        </div>

        <select
          className="task-status-select"
          value={task.status}
          onChange={(e) => onStatusChange(taskId, e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

export default TaskCard;