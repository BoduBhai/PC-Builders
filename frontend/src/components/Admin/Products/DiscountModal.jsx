import React from "react";

const DiscountModal = ({ product, loading, onApplyDiscount }) => {
  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

  const defaultDiscountPrice =
    product?.discountPrice || Math.floor(product?.price * 0.9);
  const defaultStartDate = formatDate(new Date());
  const defaultEndDate = formatDate(
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
  );

  if (!product) return null;

  return (
    <dialog
      id={`discount_modal_${product?._id}`}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">
          {product?.onDiscount ? "Update" : "Apply"} Discount
        </h3>

        {!product?.onDiscount ? (
          <div className="py-4">
            <label className="form-control w-full">
              <div className="label">
                Original Price:
                <span className="label-text-alt text-success">
                  ৳{product?.price}
                </span>
              </div>
              <input
                type="number"
                placeholder="Enter discount price"
                className="input input-bordered mt-3 w-full"
                min="1"
                max={product?.price - 1}
                required
                id={`discount-price-${product?._id}`}
                defaultValue={defaultDiscountPrice}
              />
              <div className="label">
                <span className="label-text-alt my-2 text-red-500">
                  Must be less than original price
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text mb-1">Start Date</span>
                </div>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  id={`discount-start-${product?._id}`}
                  defaultValue={defaultStartDate}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text mb-1">End Date</span>
                </div>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  id={`discount-end-${product?._id}`}
                  defaultValue={defaultEndDate}
                />
              </label>
            </div>
          </div>
        ) : (
          <p className="py-4">
            Are you sure you want to remove the discount for {product?.modelNo}?
          </p>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-success" />
            ) : (
              <button
                className="btn btn-success"
                onClick={() => {
                  if (!product?.onDiscount) {
                    const discountPrice = document.getElementById(
                      `discount-price-${product?._id}`,
                    )?.value;
                    const startDate = document.getElementById(
                      `discount-start-${product?._id}`,
                    )?.value;
                    const endDate = document.getElementById(
                      `discount-end-${product?._id}`,
                    )?.value;

                    onApplyDiscount(product, {
                      discountPrice,
                      discountStartDate: startDate,
                      discountEndDate: endDate,
                    });
                  } else {
                    onApplyDiscount(product);
                  }
                }}
              >
                {product?.onDiscount ? "Remove" : "Apply"} Discount
              </button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DiscountModal;
