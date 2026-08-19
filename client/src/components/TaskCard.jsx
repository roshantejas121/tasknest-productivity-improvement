import React from 'react';
import { updateTaskImportance, updateTaskStatus, deleteTaskFromApi } from '../services/api';
import { Check, Star, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleImportantToggle = async () => {
    try {
      await updateTaskImportance(task.id, !task.important);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task importance:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </button>
        <div className="task-copy">
          <span className="task-text">{task.title}</span>
          {task.important && <span className="important-label">Important · counts double</span>}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={handleImportantToggle}
          className={`action-btn important-button ${task.important ? 'active' : ''}`}
          title={task.important ? 'Remove important status' : 'Mark as important'}
          aria-label={task.important ? `Remove important status from ${task.title}` : `Mark ${task.title} as important`}
        >
          <Star size={18} fill={task.important ? 'currentColor' : 'none'} />
        </button>
        <button type="button" onClick={handleDelete} className="action-btn" title="Delete Task" aria-label={`Delete ${task.title}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
