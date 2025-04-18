import { Users } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import UserRow from "./UserRow";

const UserTable = ({
  filteredUsers,
  loading,
  searchTerm,
  selectedRole,
  onClearFilters,
  onViewDetails,
  onRoleToggle,
  onDelete,
}) => {
  return (
    <div
      className="overflow-y-auto"
      style={{
        maxHeight: "65vh",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
      }}
    >
      <div className="overflow-x-auto">
        <table className="table-zebra table-pin-rows table-pin-cols table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onViewDetails={onViewDetails}
                  onRoleToggle={onRoleToggle}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center">
                  {loading ? (
                    <LoadingSpinner size="md" />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Users size={40} className="mb-2 text-gray-400" />
                      <p>No users found</p>
                      {(searchTerm || selectedRole !== "All") && (
                        <button
                          className="btn btn-ghost btn-sm mt-2"
                          onClick={onClearFilters}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
