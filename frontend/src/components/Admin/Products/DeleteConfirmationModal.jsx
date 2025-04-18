const DeleteConfirmationModal = ({ product, loading, onConfirmDelete }) => {
  if (!product) return null;

  return (
    <dialog
      id="delete_product_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-error text-lg font-bold">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete <strong>{product?.modelNo}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-error" />
            ) : (
              <button
                className="btn btn-error"
                onClick={() => onConfirmDelete(product._id)}
              >
                Delete Product
              </button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmationModal;
