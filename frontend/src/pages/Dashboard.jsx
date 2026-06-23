import { useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getTasks, getStats, deleteTask, toggleTask, deleteCompletedTasks } from '../api/tasks';
import StatsCards from '../components/StatsCards';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;

      const [tasksRes, statsRes] = await Promise.all([getTasks(params), getStats()]);

      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [status, search, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      fetchData();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleDeleteCompleted = async () => {
    if (!window.confirm('Delete all completed tasks?')) return;
    try {
      await deleteCompletedTasks();
      toast.success('Completed tasks deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete completed tasks');
    }
  };

  const openAddForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div>
      <div className="navbar">
        <h2>Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>{user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <StatsCards stats={stats} />

        <div className="toolbar">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {stats.completed > 0 && (
            <button className="btn-secondary" style={{ flex: 'none' }} onClick={handleDeleteCompleted}>
              Clear Completed
            </button>
          )}

          <button className="btn-add" onClick={openAddForm}>+ Add Task</button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Click "+ Add Task" to create your first task.</p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm existingTask={editingTask} onClose={() => setShowForm(false)} onSave={fetchData} />
      )}
    </div>
  );
};

export default Dashboard;