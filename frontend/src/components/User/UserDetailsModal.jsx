import { formatDate } from "../../utils/dateUtils";

const UserDetailsModal = ({ user }) => {
  if (!user) return null;

  // Create a display name from fname and lname
  const displayName = `${user.fname || ""} ${user.lname || ""}`.trim();

  return (
    <dialog
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
                  alt={displayName}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{displayName}</h2>
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
  );
};

export default UserDetailsModal;
