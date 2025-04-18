const RoleChangeModal = ({ userId, users, loading, onConfirm }) => {
  const user = users.find((user) => user._id === userId);
  const isAdmin = user?.role === "admin";

  return (
    <dialog
      id="role_change_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">Confirm Role Change</h3>
        <p className="py-4">
          {isAdmin
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
            <button className="btn btn-primary" onClick={onConfirm}>
              Confirm Change
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default RoleChangeModal;
