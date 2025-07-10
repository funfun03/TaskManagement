type Props = {
  format?: "short" | "long";
  date?: Date | string;
};

const TaskDate = ({ date, format = "short" }: Props) => {
  const formatDate = (
    date: Date | string,
    format: "short" | "long" | undefined
  ) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (format === "long") {
      return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDateStatus = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const diffTime = parsedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: "text-red-600", bg: "bg-red-50", icon: "🔴" };
    } else if (diffDays <= 3) {
      return { color: "text-orange-600", bg: "bg-orange-50", icon: "🟡" };
    } else {
      return { color: "text-green-600", bg: "bg-green-50", icon: "🟢" };
    }
  };

  if (!date) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-sm">
        <span className="mr-1">➖</span>
        Not set
      </div>
    );
  }

  const formattedDate = formatDate(date, format);
  const status = getDateStatus(date);

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-md ${status.bg} ${status.color} text-sm font-medium`}
    >
      <span className="mr-1">{status.icon}</span>
      {formattedDate}
    </div>
  );
};

export default TaskDate;
