import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Task } from "../types/types";
import { getTaskById, updateTask } from "../services";

// Form data interface
interface TaskFormData {
  title: string;
  start_date: string;
  due_date?: string;
  description?: string;
  status: "to_do" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee_id?: string;
}

// Yup validation schema
const validationSchema: yup.ObjectSchema<TaskFormData> = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  start_date: yup
    .string()
    .required("Start date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  due_date: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
    .test(
      "due_date-after-start_date",
      "Due date must be after start date",
      function (value) {
        if (!value) return true;
        const { start_date } = this.parent;
        return new Date(value) >= new Date(start_date);
      }
    ),
  description: yup
    .string()
    .optional()
    .max(500, "Description must be less than 500 characters"),
  status: yup
    .mixed<"to_do" | "in_progress" | "done">()
    .required("Status is required")
    .oneOf(["to_do", "in_progress", "done"], "Please select a valid status"),
  priority: yup
    .mixed<"low" | "medium" | "high">()
    .required("Priority is required")
    .oneOf(["low", "medium", "high"], "Please select a valid priority"),
  assignee_id: yup
    .string()
    .optional()
    .matches(/^\d*$/, "Assignee ID must be a number"),
});

const UpdateTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    setValue,
  } = useForm<TaskFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError("No task ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const task = await getTaskById(id);

        // Format dates for form inputs
        const startDate = task.start_date
          ? new Date(task.start_date).toISOString().split("T")[0]
          : "";
        const dueDate = task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : "";

        // Set form values
        setValue("title", task.title || "");
        setValue("start_date", startDate);
        setValue("due_date", dueDate);
        setValue("description", task.description || "");
        setValue("status", task.status || "to_do");
        setValue("priority", task.priority || "medium");
        setValue(
          "assignee_id",
          task.assignee_id ? task.assignee_id.toString() : ""
        );
      } catch (error) {
        console.error("Error fetching task:", error);
        setError("Failed to load task. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, setValue]);

  const onSubmit = async (data: TaskFormData): Promise<void> => {
    if (!id) return;

    try {
      // Convert form data to Task object
      const taskData: Task = {
        id: Number(id),
        title: data.title,
        start_date: new Date(data.start_date),
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        assignee_id: data.assignee_id ? Number(data.assignee_id) : undefined,
        completed_date: data.status === "done" ? new Date() : undefined,
        created_time: new Date(), // This will be ignored by the backend for updates
        updated_time: new Date(),
      };

      await updateTask(taskData);
      navigate("/tasks");
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-strong p-8">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
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
          </div>
          <p className="text-gray-600 text-center">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-strong p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-2 bg-gradient-primary text-white rounded-xl hover:scale-[1.02] transition-all duration-200 shadow-medium"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-strong p-8 hover-lift">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">✏️</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Update Task
              </h2>
              <p className="text-gray-600 mt-1">
                Edit task details and save changes
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-3"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : !errors.title && dirtyFields.title
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Enter a descriptive task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                {...register("start_date")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.start_date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : !errors.start_date && dirtyFields.start_date
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.start_date.message}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="due_date"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                {...register("due_date")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.due_date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : !errors.due_date && dirtyFields.due_date
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.due_date && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${
                  errors.status
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : !errors.status && dirtyFields.status
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <option value="to_do">📋 To Do</option>
                <option value="in_progress">⏳ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                {...register("priority")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${
                  errors.priority
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : !errors.priority && dirtyFields.priority
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700 mb-3"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : !errors.description && dirtyFields.description
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Provide additional details about the task..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Assignee ID Field */}
          <div>
            <label
              htmlFor="assignee_id"
              className="block text-sm font-bold text-gray-700 mb-3"
            >
              Assignee ID
            </label>
            <input
              type="text"
              id="assignee_id"
              {...register("assignee_id")}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.assignee_id
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : !errors.assignee_id && dirtyFields.assignee_id
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Enter assignee ID (optional)"
            />
            {errors.assignee_id && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.assignee_id.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isSubmitting || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-secondary hover:scale-[1.02] shadow-medium hover:shadow-strong"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Updating Task...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">💾</span>
                  Update Task
                </span>
              )}
            </button>
          </div>

          {/* Form Status */}
          <div className="text-center pt-4">
            <p
              className={`text-sm ${
                isValid ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isValid ? (
                <span className="flex items-center justify-center">
                  <span className="mr-1">✓</span>
                  Ready to update task
                </span>
              ) : (
                "Please fill in all required fields"
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
