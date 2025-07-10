import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Filter, Task } from "../types/types";
import { getTasksByAssignee } from "../services";
import TaskList from "../components/TaskList";
import TaskFilterForm from "../components/TaskFilterForm";
import { searchTasks } from "../utils";

const AssigneeMe = () => {
  const assigneeId = "1";
  const navigate = useNavigate();

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByAssignee(assigneeId);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (taskId: string | number | undefined) => {
    navigate(`/update/${taskId}`);
  };

  const filteredTasks = React.useMemo(() => {
    return searchTasks(tasks, filters);
  }, [tasks, filters]);

  const handleSearch = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-medium p-8 hover-lift">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              My Assigned Tasks
            </h1>
            <p className="text-gray-600 mt-2">
              Tasks specifically assigned to you
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 px-4 py-2 rounded-xl">
              <span className="text-green-600 font-semibold">
                {filteredTasks.length} My Tasks
              </span>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👤</span>
            </div>
          </div>
        </div>
        <TaskFilterForm onSearch={handleSearch} />
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-medium overflow-hidden hover-lift">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Your Personal Tasks
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredTasks.length > 0
                  ? `${filteredTasks.length} tasks assigned to you`
                  : "No tasks currently assigned to you"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TaskList tasks={filteredTasks} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default AssigneeMe;
