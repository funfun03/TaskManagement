import { useForm } from "react-hook-form";
import type { Filter } from "../types/types";

interface FormData {
  status: string;
  priority: string;
}

type Props = {
  onSearch: (filters: Filter) => void;
};

const TaskFilterForm = ({ onSearch }: Props) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      status: "",
      priority: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const filters: Filter = {};
    if (data.status && data.status !== "") {
      filters.status = data.status;
    }
    if (data.priority && data.priority !== "") {
      filters.priority = data.priority;
    }
    onSearch(filters);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Filter Tasks
        </h3>
        <p className="text-sm text-gray-600">
          Find tasks by status and priority
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="to_do">📋 To Do</option>
              <option value="in_progress">⏳ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Priority Filter */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Priority
            </label>
            <select
              id="priority"
              {...register("priority")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-primary rounded-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  🔍 Search
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskFilterForm;
