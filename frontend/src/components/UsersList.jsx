import { Trash, Eye } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "../stores/useAdminStore";
import toast from "react-hot-toast";
import { formatDate } from "../utils/dateUtils";

const UsersList = () => {
  const { users, toggleRole, deleteUser, loading } = useAdminStore();
  const [roleChangeUserId, setRoleChangeUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

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
    <div className="bg-base-200 container mx-auto mt-10 mb-20 max-w-6xl rounded-lg p-5 shadow-md">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={user.profilePicture || `/avatar.avif`}
                          alt={user.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Customer</span>
                    <input
                      type="checkbox"
                      checked={
                        user.role === "admin" || user.role === "superadmin"
                      }
                      className={`toggle ${
                        user.role === "admin" || user.role === "superadmin"
                          ? "toggle-primary"
                          : "toggle-secondary"
                      }`}
                      onChange={() => handleRoleToggleClick(user._id)}
                    />
                    <span className="text-xs font-medium">Admin</span>
                  </div>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td className="flex h-full items-center gap-2">
                  <button
                    className="btn btn-outline btn-info mr-2"
                    onClick={() => handleViewDetailsClick(user)}
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    <Trash className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User details view modals */}
      {users?.map((user) => (
        <dialog
          key={`dialog-${user._id}`}
          id={`view_modal_${user._id}`}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="text-lg font-bold">User Details</h3>
            <div className="space-y-4 py-4">
              {/* User avatar and name header */}
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="mask mask-squircle h-16 w-16">
                    <img
                      src={user.profilePicture || "/avatar.avif"}
                      alt={user.name}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm opacity-70">{user.email}</p>
                </div>
              </div>

              {/* User details */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div>
                  <p className="text-sm font-semibold opacity-70">Full Name</p>
                  <p className="font-medium">{`${user.fname || ""} ${user.lname || ""}`}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-70">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-70">Join Date</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-70">Phone</p>
                  <p className="font-medium">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-70">User ID</p>
                  <p className="text-xs font-medium">{user._id}</p>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-outline">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      ))}

      {/* Role change confirmation modal */}
      <dialog
        id="role_change_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Role Change</h3>
          <p className="py-4">
            {roleChangeUserId &&
            users.find((user) => user._id === roleChangeUserId)?.role ===
              "admin"
              ? "Are you sure you want to change this user from Admin to Customer?"
              : "Are you sure you want to give this user Admin privileges?"}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-primary" />
            ) : (
              <button className="btn btn-primary" onClick={confirmRoleChange}>
                Confirm Change
              </button>
            )}
          </div>
        </div>
      </dialog>

      {/* Delete confirmation modal */}
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-error text-lg font-bold">Confirm Deletion</h3>
          <p className="py-4">
            {deleteUserId &&
              `Are you sure you want to delete ${users.find((user) => user._id === deleteUserId)?.name}? This action cannot be undone.`}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-primary" />
            ) : (
              <button className="btn btn-error" onClick={confirmDeleteUser}>
                Delete User
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UsersList;
