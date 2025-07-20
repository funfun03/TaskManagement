import { useState, useEffect } from "react";
import {
  getUsers,
  addRoleToUser,
  createUser,
  updateUser,
  deleteUser,
  removeRoleFromUser,
} from "../services/users.service";
import { getRoles } from "../services/roles.service";

// Types based on your API
interface User {
  id?: number;
  username: string;
  fullName: string;
  status?: "active" | "inactive";
  roles: Array<{
    id: number;
    code: string;
    name: string;
    description: string;
  }>;
}

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
  });
  const [editUser, setEditUser] = useState({
    username: "",
    fullName: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Gọi cả hai API cùng lúc
      const [usersResponse, rolesResponse] = await Promise.all([
        getUsers(),
        getRoles(),
      ]);

      console.log("Users response:", usersResponse);
      console.log("Roles response:", rolesResponse);

      // Handle different response structures
      const usersData = usersResponse.data || usersResponse || [];
      const rolesData = rolesResponse.data || rolesResponse || [];

      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setUsers([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal để add role cho user
  const openAddRoleModal = (user: User) => {
    setSelectedUser(user);
    setShowAddRoleModal(true);
  };

  // Đóng modal
  const closeAddRoleModal = () => {
    setSelectedUser(null);
    setShowAddRoleModal(false);
  };

  // Thêm role cho user
  const handleAddRole = async (roleId: number) => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      console.log(`Adding role ${roleId} to user ${selectedUser.id}`);

      await addRoleToUser(selectedUser.id!, roleId);

      // Reload data để cập nhật UI
      await loadData();

      alert("Role added successfully!");
      closeAddRoleModal();
    } catch (error: any) {
      console.error("Error adding role:", error);

      // Log chi tiết error response
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.details ||
          `Server error: ${error.response.status}`;
        alert(`Failed to add role: ${errorMessage}`);
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to add role: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Check xem user đã có role này chưa
  const userHasRole = (user: User, roleId: number): boolean => {
    return user.roles?.some((role) => role.id === roleId) || false;
  };

  // Hàm tạo user mới
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newUser.username.trim() ||
      !newUser.password.trim() ||
      !newUser.fullName.trim()
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Creating new user:", newUser);

      await createUser({
        username: newUser.username,
        password: newUser.password,
        fullName: newUser.fullName,
      });

      await loadData();
      alert("User created successfully!");
      setShowCreateModal(false);
      setNewUser({ username: "", password: "", fullName: "" });
    } catch (error: any) {
      console.error("Error creating user:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        alert(`Failed to create user: ${errorMessage}`);
      } else {
        alert(`Failed to create user: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm cập nhật user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedUser ||
      !editUser.username.trim() ||
      !editUser.fullName.trim()
    ) {
      alert("Username and Full Name are required!");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Updating user:", selectedUser.id, editUser);

      await updateUser(selectedUser.id!, {
        username: editUser.username,
        fullName: editUser.fullName,
      });

      await loadData();
      alert("User updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
      setEditUser({ username: "", fullName: "" });
    } catch (error: any) {
      console.error("Error updating user:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        alert(`Failed to update user: ${errorMessage}`);
      } else {
        alert(`Failed to update user: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm xóa user
  const handleDeleteUser = async (user: User) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${
        user.fullName || user.username
      }"?`
    );

    if (!confirmDelete) return;

    try {
      setSubmitting(true);
      console.log("Deleting user:", user.id);

      await deleteUser(user.id!);

      await loadData();
      alert("User deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting user:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        alert(`Failed to delete user: ${errorMessage}`);
      } else {
        alert(`Failed to delete user: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm remove role từ user
  const handleRemoveRole = async (user: User, roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    const confirmRemove = window.confirm(
      `Remove role "${role?.name}" from user "${
        user.fullName || user.username
      }"?`
    );

    if (!confirmRemove) return;

    try {
      setSubmitting(true);
      console.log(`Removing role ${roleId} from user ${user.id}`);

      await removeRoleFromUser(user.id!, roleId);

      await loadData();
      alert("Role removed successfully!");
    } catch (error: any) {
      console.error("Error removing role:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        alert(`Failed to remove role: ${errorMessage}`);
      } else {
        alert(`Failed to remove role: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Mở modal tạo user
  const openCreateModal = () => {
    setNewUser({ username: "", password: "", fullName: "" });
    setShowCreateModal(true);
  };

  // Mở modal edit user
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditUser({ username: user.username, fullName: user.fullName });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-gray-500 mt-2">
              Manage users and their role assignments
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-medium hover:shadow-large hover-lift flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add New User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-blue-500">Total Users</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">
              {roles.length}
            </div>
            <div className="text-sm text-purple-500">Available Roles</div>
          </div>
        </div>
      </div>

      {/* Available Roles Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Available Roles in System
        </h2>
        {roles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:shadow-medium transition-all duration-200"
              >
                <div className="font-semibold text-gray-800">{role.name}</div>
                <div className="text-sm text-gray-500 mb-1">({role.code})</div>
                {role.description && (
                  <div className="text-xs text-gray-400 mt-2">
                    {role.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔒</div>
            <div>No roles found in system</div>
          </div>
        )}
      </div>

      {/* Users List Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Users and their assigned roles
        </h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-medium transition-all duration-200"
            >
              {/* User Info Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {(user.fullName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.fullName || user.username}
                    </h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-400">ID: {user.id}</p>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Assigned Roles:
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {user.roles?.length || 0} roles
                  </span>
                </div>

                {user.roles && user.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <div
                        key={role.id}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm group hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="font-medium text-gray-800">
                              {role.name}
                            </span>
                            <span className="text-gray-500 ml-1">
                              ({role.code})
                            </span>
                            {role.description && (
                              <div className="text-xs text-gray-400 mt-1">
                                {role.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveRole(user, role.id)}
                            disabled={submitting}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Remove role"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-sm">No roles assigned</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => openAddRoleModal(user)}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover-lift flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Role
                </button>

                <button
                  onClick={() => openEditModal(user)}
                  disabled={submitting}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover-lift flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit User
                </button>

                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={submitting}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover-lift flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete User
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-xl font-medium mb-2">No users found</div>
            <div className="text-sm">
              Click "Add New User" to create your first user
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Role */}
      {showAddRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                Add Role to {selectedUser.fullName || selectedUser.username}
              </h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Available Roles:
              </h4>

              <div className="space-y-3">
                {roles.map((role) => {
                  const hasRole = userHasRole(selectedUser, role.id);
                  return (
                    <div
                      key={role.id}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        hasRole
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              {role.name}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {role.code}
                            </span>
                            {hasRole && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Already assigned
                              </span>
                            )}
                          </div>
                          {role.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {role.description}
                            </p>
                          )}
                        </div>

                        {!hasRole && (
                          <button
                            onClick={() => handleAddRole(role.id)}
                            disabled={submitting}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {submitting ? (
                              <>
                                <svg
                                  className="animate-spin w-4 h-4"
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
                                Adding...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                Add
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeAddRoleModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create User */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                Create New User
              </h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCreateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                Edit User: {selectedUser.fullName || selectedUser.username}
              </h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={editUser.username}
                    onChange={(e) =>
                      setEditUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editUser.fullName}
                    onChange={(e) =>
                      setEditUser((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
