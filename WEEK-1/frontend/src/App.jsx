import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import DashboardStats from "./components/DashboardStats";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import Column from "./components/Column";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/tasks"
        );

        console.log("API Response:", res.data);

        // Handles both:
        // [ ... ]
        // { success:true, data:[ ... ] }

        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else if (
          res.data &&
          Array.isArray(res.data.data)
        ) {
          setTasks(res.data.data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Failed to fetch tasks from server"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  let filteredTasks = safeTasks.filter(
    (task) => {
      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    }
  );

  if (sortBy === "title") {
    filteredTasks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sortBy === "priority") {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    filteredTasks.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  if (loading) {
    return (
      <div className="loading">
        Loading Tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <DashboardStats tasks={safeTasks} />

        <div className="controls">
          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={
              setPriorityFilter
            }
          />

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="default">
              Sort By
            </option>

            <option value="title">
              Title
            </option>

            <option value="priority">
              Priority
            </option>
          </select>
        </div>

        <div className="board">
          <Column
            title="To Do"
            tasks={filteredTasks.filter(
              (task) =>
                task.status === "To Do"
            )}
          />

          <Column
            title="In Progress"
            tasks={filteredTasks.filter(
              (task) =>
                task.status ===
                "In Progress"
            )}
          />

          <Column
            title="Review"
            tasks={filteredTasks.filter(
              (task) =>
                task.status ===
                "Review"
            )}
          />

          <Column
            title="Completed"
            tasks={filteredTasks.filter(
              (task) =>
                task.status ===
                "Completed"
            )}
          />
        </div>
      </div>
    </>
  );
}

export default App;