const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span>{task.priority} Priority</span>
        {task.dueDate && (
          <span style={{ color: isOverdue ? '#dc2626' : '#6b7280' }}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-complete" onClick={() => onToggle(task._id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;