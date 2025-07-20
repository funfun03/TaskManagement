import { useState, useEffect } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roles.service";

// Types based on your API
interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
}

interface NewRole {
  code: string;
  name: string;
  description: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newRole, setNewRole] = useState<NewRole>({
    code: "",
    name: "",
    description: "",
  });
  const [editRole, setEditRole] = useState<NewRole>({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      console.log("Roles response:", response);

      // Handle different response structures
      const rolesData = response.data || response || [];
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Error loading roles:", error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal để add role
  const openAddModal = () => {
    setNewRole({ code: "", name: "", description: "" });
    setShowAddModal(true);
  };

  // Đóng modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewRole({ code: "", name: "", description: "" });
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Thêm role mới
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRole.code.trim() || !newRole.name.trim()) {
      alert("Code and Name are required!");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Creating new role:", newRole);

      await createRole(newRole);

      // Reload data để cập nhật UI
      await loadRoles();

      alert("Role created successfully!");
      closeAddModal();
    } catch (error: any) {
      console.error("Error creating role:", error);

      // Log chi tiết error response
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.details ||
          `Server error: ${error.response.status}`;
        alert(`Failed to create role: ${errorMessage}`);
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to create role: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Mở modal edit role
  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setEditRole({
      code: role.code,
      name: role.name,
      description: role.description,
    });
    setShowEditModal(true);
  };

  // Đóng modal edit
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedRole(null);
    setEditRole({ code: "", name: "", description: "" });
  };

  // Handle input change for edit
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cập nhật role
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole || !editRole.code.trim() || !editRole.name.trim()) {
      alert("Code and Name are required!");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Updating role:", selectedRole.id, editRole);

      await updateRole(selectedRole.id, editRole);

      // Reload data để cập nhật UI
      await loadRoles();

      alert("Role updated successfully!");
      closeEditModal();
    } catch (error: any) {
      console.error("Error updating role:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.details ||
          `Server error: ${error.response.status}`;
        alert(`Failed to update role: ${errorMessage}`);
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to update role: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa role
  const handleDeleteRole = async (role: Role) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete role "${role.name}" (${role.code})?`
    );

    if (!confirmDelete) return;

    try {
      setSubmitting(true);
      console.log("Deleting role:", role.id);

      await deleteRole(role.id);

      // Reload data để cập nhật UI
      await loadRoles();

      alert("Role deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting role:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.details ||
          `Server error: ${error.response.status}`;
        alert(`Failed to delete role: ${errorMessage}`);
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to delete role: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Roles Management
            </h1>
            <p className="text-gray-500 mt-2">
              Create and manage system roles and permissions
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-medium hover:shadow-large hover-lift flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add New Role
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">
            {roles.length}
          </div>
          <div className="text-sm text-purple-500">Total Roles</div>
        </div>
      </div>

      {/* Roles List Section */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          System Roles
        </h2>

        {roles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-medium transition-all duration-200 group"
              >
                {/* Role Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {role.code.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                        {role.name}
                      </h3>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                        {role.code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">ID:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {role.id}
                    </span>
                  </div>

                  {role.description && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Description
                      </span>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openEditModal(role)}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🔐</div>
            <div className="text-xl font-medium mb-2">No roles found</div>
            <div className="text-sm">
              Click "Add New Role" to create your first role
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Role */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Add New Role</h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddRole} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={newRole.code}
                    onChange={handleInputChange}
                    placeholder="e.g., ADMIN, USER, MANAGER"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newRole.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Administrator, User, Manager"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newRole.description}
                    onChange={handleInputChange}
                    placeholder="Role description (optional)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-vertical"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    "Create Role"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Role */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                Edit Role: {selectedRole.name}
              </h3>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpdateRole} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={editRole.code}
                    onChange={handleEditInputChange}
                    placeholder="e.g., ADMIN, USER, MANAGER"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editRole.name}
                    onChange={handleEditInputChange}
                    placeholder="e.g., Administrator, User, Manager"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editRole.description}
                    onChange={handleEditInputChange}
                    placeholder="Role description (optional)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    "Update Role"
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

export default Roles;
