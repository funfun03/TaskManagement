import type { Task } from "../types/types";

type Props = {
  priority: "low" | "medium" | "high";
};

const TaskPriority = ({ priority }: Props) => {
  const getPriorityBadge = (priority: Task["priority"]) => {
    const priorityConfig = {
      low: {
        styles: "bg-green-50 text-green-700 border-green-300",
        label: "Low",
        icon: "🟢",
      },
      medium: {
        styles: "bg-yellow-50 text-yellow-700 border-yellow-300",
        label: "Medium",
        icon: "🟡",
      },
      high: {
        styles: "bg-red-50 text-red-700 border-red-300",
        label: "High",
        icon: "🔴",
      },
    };

    const config = priorityConfig[priority];

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${config.styles} shadow-sm`}
      >
        <span className="mr-2">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return <div>{getPriorityBadge(priority)}</div>;
};

export default TaskPriority;
