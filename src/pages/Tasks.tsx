import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import TaskFilterForm from "../components/TaskFilterForm";
import TaskList from "../components/TaskList";
import { searchTasks } from "../utils/index";

import type { Filter, Task } from "../types/types";
import { getTasks } from "../services";
import { set } from "react-hook-form";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});

  useEffect(() => {
    const fecthTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fecthTasks();
  }, []);

  const handleSearch = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  const handleEdit = (taskId: string | number | undefined) => {
    navigate(`/update/${taskId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-medium p-8 hover-lift">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all your tasks efficiently
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-xl">
              <span className="text-blue-600 font-semibold">
                {searchTasks(tasks, filters).length} Tasks
              </span>
            </div>
          </div>
        </div>
        <TaskFilterForm onSearch={handleSearch} />
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-medium overflow-hidden hover-lift">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
              <p className="text-gray-600 mt-1">
                {searchTasks(tasks, filters).length > 0
                  ? `${searchTasks(tasks, filters).length} tasks found`
                  : "No tasks match your current filters"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TaskList tasks={searchTasks(tasks, filters)} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
