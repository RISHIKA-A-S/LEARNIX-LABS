import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import DashboardStats from "./components/DashboardStats";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import Column from "./components/Column";

import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

const emptyForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const normalizeStatus = (status) => {
    if (status === "Pending") return "To Do";
    return status;
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setTasks(res.data.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback("Please enter a task title");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const res = await axios.post(API_URL, formData);
      setTasks((prev) => [res.data, ...prev]);
      setFormData(emptyForm);
      setFeedback("Task created successfully");
    } catch (err) {
      console.error(err);
      setFeedback("Could not create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks((prev) => prev.filter((task) => (task._id || task.id) !== taskId));
      setFeedback("Task deleted");
    } catch (err) {
      console.error(err);
      setFeedback("Could not delete task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find((task) => (task._id || task.id) === taskId);

    if (!taskToUpdate) return;

    try {
      const res = await axios.put(`${API_URL}/${taskId}`, {
        ...taskToUpdate,
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((task) => ((task._id || task.id) === taskId ? res.data : task))
      );
    } catch (err) {
      console.error(err);
      setFeedback("Could not update task status");
    }
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const normalizedTasks = safeTasks.map((task) => ({
    ...task,
    status: normalizeStatus(task.status),
  }));

  let filteredTasks = normalizedTasks.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (sortBy === "title") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortBy === "priority") {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  if (loading) {
    return <div className="loading">Loading Tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <DashboardStats tasks={normalizedTasks} />

        <form className="task-form" onSubmit={handleSubmit}>
          <h2>Add a new task</h2>

          <div className="task-form-row">
            <input
              name="title"
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Task description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <div className="task-form-row">
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>

            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add Task"}
            </button>
          </div>
        </form>

        {feedback && <p className="feedback">{feedback}</p>}

        <div className="controls">
          <SearchBar search={search} setSearch={setSearch} />

          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />

          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="board">
          <Column
            title="To Do"
            tasks={filteredTasks.filter((task) => task.status === "To Do")}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />

          <Column
            title="In Progress"
            tasks={filteredTasks.filter((task) => task.status === "In Progress")}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />

          <Column
            title="Review"
            tasks={filteredTasks.filter((task) => task.status === "Review")}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />

          <Column
            title="Completed"
            tasks={filteredTasks.filter((task) => task.status === "Completed")}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

export default App;