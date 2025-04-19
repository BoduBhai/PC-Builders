import { useState, useEffect } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import toast from "react-hot-toast";
import UserSearchBar from "./User/UserSearchBar";
import UserFilterPanel from "./User/UserFilterPanel";
import UserTable from "./User/UserTable";
import UserDetailsModal from "./User/UserDetailsModal";
import RoleChangeModal from "./User/RoleChangeModal";
import DeleteUserModal from "./User/DeleteUserModal";

const UsersList = () => {
  const { users, toggleRole, deleteUser, loading } = useAdminStore();
  const [roleChangeUserId, setRoleChangeUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Apply filters whenever users or filter values change
  useEffect(() => {
    if (!users) return;

    const filtered = users.filter((user) => {
      // Search term filter
      const searchMatch =
        searchTerm === "" ||
        `${user.fname || ""} ${user.lname || ""}`
          .trim()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const roleMatch =
        selectedRole === "All" ||
        (selectedRole === "Admin" &&
          (user.role === "admin" || user.role === "superadmin")) ||
        (selectedRole === "Customer" && user.role === "customer");

      return searchMatch && roleMatch;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("All");
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleViewDetailsClick = (user) => {
    document.getElementById(`view_modal_${user._id}`).showModal();
  };

  const handleRoleToggleClick = (userId) => {
    setRoleChangeUserId(userId);
    document.getElementById("role_change_modal").showModal();
  };

  const confirmRoleChange = async () => {
    toast.loading("Changing user role...", { id: "role_change" });
    if (roleChangeUserId) {
      try {
        await toggleRole(roleChangeUserId);
        const user = users.find((user) => user._id === roleChangeUserId);
        toast.success(
          user.role === "admin"
            ? `${user.fname} is changed to a Customer`
            : `${user.fname} is changed to an Admin`,
          { id: "role_change" },
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error toggling user role",
          { id: "role_change" },
        );
      } finally {
        setRoleChangeUserId(null);
      }
      document.getElementById("role_change_modal").close();
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    document.getElementById("delete_modal").showModal();
  };

  const confirmDeleteUser = async () => {
    toast.loading("Deleting user...", { id: "delete_user" });
    if (deleteUserId) {
      try {
        await deleteUser(deleteUserId);
        toast.success("User deleted successfully", { id: "delete_user" });
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting user", {
          id: "delete_user",
        });
      } finally {
        setDeleteUserId(null);
      }
    }
    document.getElementById("delete_modal").close();
  };

  return (
    <>
      <h2 className="mt-4 mb-10 text-center text-3xl font-bold">Users List</h2>
      <div className="card bg-base-100 border-base-300 border shadow-xl">
        <div className="card-body p-0">
          {/* Search bar component */}

          <UserSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            isFilterOpen={isFilterOpen}
            toggleFilters={toggleFilters}
          />

          {/* Filter panel component */}
          <UserFilterPanel
            isFilterOpen={isFilterOpen}
            selectedRole={selectedRole}
            onRoleFilterChange={handleRoleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* User table component */}
          <UserTable
            filteredUsers={filteredUsers}
            loading={loading}
            searchTerm={searchTerm}
            selectedRole={selectedRole}
            onClearFilters={handleClearFilters}
            onViewDetails={handleViewDetailsClick}
            onRoleToggle={handleRoleToggleClick}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* User details view modals */}
        {users?.map((user) => (
          <UserDetailsModal key={`details-${user._id}`} user={user} />
        ))}

        {/* Role change confirmation modal */}
        <RoleChangeModal
          userId={roleChangeUserId}
          users={users}
          loading={loading}
          onConfirm={confirmRoleChange}
        />

        {/* Delete confirmation modal */}
        <DeleteUserModal
          userId={deleteUserId}
          users={users}
          loading={loading}
          onConfirm={confirmDeleteUser}
        />
      </div>
    </>
  );
};

export default UsersList;
