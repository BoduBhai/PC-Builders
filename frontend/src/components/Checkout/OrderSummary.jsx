import React from "react";

const OrderSummary = ({
  cart,
  isProcessing,
  orderLoading,
  paymentMethod,
  isCardPaymentConfirmed,
  isBankTransferConfirmed,
  handleSubmit,
}) => {
  return (
    <div className="card bg-base-200 sticky top-20 shadow-md">
      <div className="card-body">
        <h2 className="card-title border-b pb-4">Order Summary</h2>

        <dl className="py-4">
          <div className="flex justify-between pb-2">
            <dt>Items ({cart.totalItems}):</dt>
            <dd>৳{cart.totalPrice.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt>Shipping:</dt>
            <dd className="text-success">Free</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt>Tax (10%):</dt>
            <dd>৳{(cart.totalPrice * 0.1).toFixed(2)}</dd>
          </div>
        </dl>

        <div className="border-t pt-4">
          <div className="flex justify-between pb-4">
            <dt className="text-lg font-bold">Order Total:</dt>
            <dd className="text-lg font-bold">
              ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
            </dd>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
            disabled={
              isProcessing ||
              orderLoading ||
              !paymentMethod ||
              (paymentMethod === "card" && !isCardPaymentConfirmed) ||
              (paymentMethod === "bank_transfer" && !isBankTransferConfirmed)
            }
            aria-busy={isProcessing || orderLoading}
          >
            {isProcessing || orderLoading ? (
              <span className="flex items-center">
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Processing...
              </span>
            ) : !paymentMethod ? (
              "Select a payment method"
            ) : paymentMethod === "card" && !isCardPaymentConfirmed ? (
              "Confirm card payment first"
            ) : paymentMethod === "bank_transfer" &&
              !isBankTransferConfirmed ? (
              "Confirm bank transfer first"
            ) : paymentMethod === "pay_on_pickup" ? (
              `Place Order - Pay during pickup`
            ) : (
              `Place Order ৳${(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}`
            )}
          </button>
        </div>

        <section className="mt-6">
          <h3 className="mb-2 text-lg font-medium">Order Items</h3>
          <ul className="max-h-64 overflow-y-auto" aria-label="Order items">
            {cart.items.map((item) => (
              <li
                key={item.product._id}
                className="border-primary/80 mb-3 flex items-center gap-3 border-b pb-3 last:mb-0 last:border-b-0"
              >
                <figure className="h-12 w-12 overflow-hidden rounded-md">
                  <img
                    src={item.product.image}
                    alt={item.product.modelNo}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium">
                    {item.product.modelNo}
                  </p>
                  <div className="text-xs text-gray-500">
                    ৳
                    {(item.product.onDiscount
                      ? item.product.discountPrice
                      : item.product.price
                    ).toFixed(2)}{" "}
                    x {item.quantity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default OrderSummary;
