// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\User\Orders\CancelOrderModal.jsx
const CancelOrderModal = ({ orderId, orders, loading, onConfirm }) => {
  const order = orders?.find((order) => order._id === orderId);

  return (
    <dialog
      id="cancel_order_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-error text-lg font-bold">
          Confirm Order Cancellation
        </h3>
        <p className="py-4">
          {order &&
            `Are you sure you want to cancel order #${order._id.slice(-8)}? This action cannot be undone.`}
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">No, Keep Order</button>
          </form>
          {loading ? (
            <span className="loading loading-spinner loading-xl text-primary" />
          ) : (
            <button className="btn btn-error" onClick={onConfirm}>
              Yes, Cancel Order
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default CancelOrderModal;
