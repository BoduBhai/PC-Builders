import { Trash, Eye } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const UserRow = ({ user, onViewDetails, onRoleToggle, onDelete }) => {
  // Create a display name from fname and lname
  const displayName = `${user.fname || ""} ${user.lname || ""}`.trim();

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img
                src={user.profilePicture || `/avatar.avif`}
                alt={displayName}
              />
            </div>
          </div>
          <div>
            <div className="font-semibold">{displayName}</div>
            <div className="text-sm opacity-50">{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Customer</span>
          <input
            type="checkbox"
            checked={user.role === "admin" || user.role === "superadmin"}
            className={`toggle ${
              user.role === "admin" || user.role === "superadmin"
                ? "toggle-primary"
                : "toggle-secondary"
            }`}
            onChange={() => onRoleToggle(user._id)}
          />
          <span className="text-xs font-medium">Admin</span>
        </div>
      </td>
      <td>{formatDate(user.createdAt)}</td>
      <td className="flex h-full items-center gap-2">
        <button
          className="btn btn-outline btn-info mr-2"
          onClick={() => onViewDetails(user)}
        >
          <Eye className="size-4" />
        </button>
        <button
          className="cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => onDelete(user._id)}
        >
          <Trash className="size-5" />
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
