function TaskCard({ task }) {

  const priorityClass =
    task.priority.toLowerCase();

  return (
    <div className="task-card">

      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-footer">

        <span
          className={`priority ${priorityClass}`}
        >
          {task.priority}
        </span>

        <span className="date">
          📅 {task.dueDate}
        </span>

      </div>

    </div>
  );
}

export default TaskCard;