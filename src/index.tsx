import { useContext, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router";

import { LoginContext } from "./context/context";
import AssigneeMe from "./pages/AssigneeMe";
import CreateTask from "./pages/CreateTask";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import UpdateTask from "./pages/UpdateTask";
import AccessDenied from "./pages/AccessDenied";

// Navigation component

const Navigation = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(LoginContext);

  if (!user) {
    return null;
  }

  const navItems = [
    { path: "/tasks", label: "Tasks", exact: true },
    { path: "/create", label: "Create Task", exact: false },
    { path: "/assignee-me", label: "Assigned to Me", exact: false },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 mb-8 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-500">
                Manage your tasks efficiently
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover-lift ${
                  isActive(item.path, item.exact)
                    ? "bg-gradient-primary text-white shadow-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setUser(null);
                navigate("/login");
              }}
              className="ml-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-secondary text-white hover-lift shadow-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const TaskManagement = () => {
  const [user, setUser] = useState(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <LoginContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Navigation />
          <div className="container mx-auto px-6 py-8">
            <div className="animate-fade-in">
              <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />

                {user && <Route path="/tasks" element={<Tasks />} />}
                {user && <Route path="/create" element={<CreateTask />} />}
                {user && <Route path="/update/:id" element={<UpdateTask />} />}
                {user && <Route path="/assignee-me" element={<AssigneeMe />} />}
                <Route path="*" element={<AccessDenied />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </LoginContext.Provider>
    </div>
  );
};

export default TaskManagement;
