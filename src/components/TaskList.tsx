import type { Task } from "../types/types";
import TaskDate from "./TaskDate";
import TaskPriority from "./TaskPriority";
import TaskStatus from "./TaskStatus";
import TaskTitle from "./TaskTitle";

type Props = {
  tasks: Task[];
  onEdit: (taskId: string | number | undefined) => void;
};

const TaskList = ({ tasks, onEdit }: Props) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Completed
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Assignee
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {tasks.map((task: Task, index: number) => (
            <tr
              key={task.id}
              className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4">
                <TaskTitle
                  task={{ title: task.title, description: task.description }}
                />
              </td>
              <td className="px-6 py-4 text-center">
                <TaskStatus task={task} />
              </td>
              <td className="px-6 py-4 text-center">
                <TaskPriority priority={task.priority} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <TaskDate date={task.start_date} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <TaskDate date={task.due_date} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <TaskDate date={task.completed_date} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-semibold">
                      {task.assignee_id
                        ? task.assignee_id.toString().charAt(0)
                        : "U"}
                    </span>
                  </div>
                  <span className="font-medium">
                    {task.assignee_id
                      ? `User ${task.assignee_id}`
                      : "Unassigned"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEdit?.(task.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-primary hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-medium"
                >
                  <span className="mr-2">✏️</span>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
