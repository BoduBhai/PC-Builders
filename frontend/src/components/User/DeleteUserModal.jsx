const DeleteUserModal = ({ userId, users, loading, onConfirm }) => {
  const user = users.find((user) => user._id === userId);

  return (
    <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="text-error text-lg font-bold">Confirm Deletion</h3>
        <p className="py-4">
          {user &&
            `Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          {loading ? (
            <span className="loading loading-spinner loading-xl text-primary" />
          ) : (
            <button className="btn btn-error" onClick={onConfirm}>
              Delete User
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default DeleteUserModal;
