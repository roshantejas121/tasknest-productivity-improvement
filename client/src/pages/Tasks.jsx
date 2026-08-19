import React, { useEffect, useState } from 'react';
import { Filter, ListTodo, Search } from 'lucide-react';
import { fetchTasks } from '../services/api';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchTasks()
      .then((data) => {
        if (active) {
          setTasks(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="animate-fade">
      <header className="welcome-section">
        <h1>All Tasks</h1>
        <p>Manage and track every detail of your workflow.</p>
      </header>

      <div className="section-title">
        <h3><ListTodo size={22} color="var(--primary)" style={{ marginRight: '10px' }} /> Master List</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="action-btn"><Search size={18} /></div>
          <div className="action-btn"><Filter size={18} /></div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading tasks...
        </div>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onTaskUpdated={getTasks} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
