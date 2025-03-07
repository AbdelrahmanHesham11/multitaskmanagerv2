import React from "react";
import { deleteCompletedTasks } from "../services/api"; // ✅ Import delete function

import { Task } from '../types/types'; // 👈 Correct path to types.ts

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   completed?: boolean;
//   status: string;
//   user: string;
// }

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
  refreshTasks: () => void; // ✅ Added refreshTasks prop
}

export default function TaskList({ tasks, onTaskComplete, refreshTasks }: TaskListProps) {
  // Separate tasks into incomplete and completed
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  // ✅ Handle delete completed tasks
  const handleDeleteCompleted = async () => {
    await deleteCompletedTasks();
    refreshTasks(); // Reload tasks after deletion
  };

  return (
    <div>
      {/* Incomplete Tasks Section */}
      <h2 className="text-xl font-bold mb-4">Incomplete Tasks</h2>
      <ul>
        {incompleteTasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            <span>
              <strong>{task.title}</strong> - {task.description} ({task.status})
            </span>
            <button
              onClick={() => onTaskComplete(task.id)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ✔️
            </button>
          </li>
        ))}
      </ul>

      {/* Finished Tasks Section */}
      {completedTasks.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6 mb-4">Finished Tasks</h2>
          <ul>
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between mb-2 opacity-50"
              >
                <span style={{ textDecoration: "line-through" }}>
                  <strong>{task.title}</strong> - {task.description} ({task.status})
                </span>
              </li>
            ))}
          </ul>

          {/* ✅ Button to delete completed tasks */}
          <button
            onClick={handleDeleteCompleted}
            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Delete All Completed Tasks
          </button>
        </>
      )}
    </div>
  );
}
