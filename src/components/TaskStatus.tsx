import type { Task } from "../types/types";

const TaskStatus = ({ task }: { task: Task }) => {
  const getStatusBadge = (status: Task["status"]) => {
    const statusConfig = {
      to_do: {
        styles: "bg-gray-100 text-gray-800 border-gray-300",
        label: "To Do",
        icon: "📋",
      },
      in_progress: {
        styles: "bg-blue-100 text-blue-800 border-blue-300",
        label: "In Progress",
        icon: "⏳",
      },
      done: {
        styles: "bg-green-100 text-green-800 border-green-300",
        label: "Done",
        icon: "✅",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${config.styles} shadow-sm`}
      >
        <span className="mr-2">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return <div>{getStatusBadge(task.status)}</div>;
};

export default TaskStatus;
