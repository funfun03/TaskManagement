type Props = {
  task: {
    title: string;
    description?: string;
  };
};

const TaskTitle = ({ task }: Props) => {
  return (
    <div className="flex flex-col max-w-md">
      <div className="text-sm font-bold text-gray-900 mb-1 leading-tight">
        {task.title}
      </div>
      {task.description && (
        <div className="text-xs text-gray-600 leading-relaxed">
          <div className="bg-gray-50 px-3 py-1 rounded-lg border-l-4 border-blue-200">
            {task.description.length > 100
              ? `${task.description.substring(0, 100)}...`
              : task.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTitle;
