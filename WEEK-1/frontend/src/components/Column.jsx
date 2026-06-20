import TaskCard from "./TaskCard";

function Column({ title, tasks }) {

  return (
    <div className="column">

      <div className="column-header">
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </div>

      {
        tasks.length === 0
        ?
        <p className="empty">
          No Tasks
        </p>
        :
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))
      }

    </div>
  );
}

export default Column;