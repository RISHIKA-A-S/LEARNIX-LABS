const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Setup Node.js Server",
    description: "Create Express server",
    status: "To Do",
    priority: "High"
  },
  {
    id: 2,
    title: "Design UI Components",
    description: "Create reusable React components",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: 3,
    title: "Code Review",
    description: "Review project implementation",
    status: "Review",
    priority: "Low"
  },
  {
    id: 4,
    title: "Deploy Project",
    description: "Deploy frontend and backend",
    status: "Completed",
    priority: "High"
  }
];

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});