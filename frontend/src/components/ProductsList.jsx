import { Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";
import { toast } from "react-hot-toast";

import {
  categoryOptions,
  brandOptions,
  colorOptions,
} from "../utils/constants";

const ProductsList = () => {
  const {
    products,
    toggleProductDiscount,
    updateProduct,
    deleteProduct,
    loading,
  } = useProductStore();

  const [editFormData, setEditFormData] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);

  const handleEditClick = (product) => {
    setEditFormData({
      category: product.category,
      modelNo: product.modelNo,
      description: product.description,
      price: product.price,
      stock: product.stock,
      brand: product.brand || "",
      color: product.color || "",
    });
    document.getElementById(`edit_modal_${product._id}`).showModal();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleDiscountToggle = async (product, discountData) => {
    try {
      if (!product.onDiscount) {
        await toggleProductDiscount(product._id, discountData);
      } else {
        await toggleProductDiscount(product._id);
      }
      document.getElementById(`discount_modal_${product._id}`).close();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update discount";
      toast.error(errorMsg);
      console.error("Discount update error:", error);
    }
  };

  const handleProductUpdate = async (productId) => {
    try {
      await updateProduct(productId, editFormData);
      document.getElementById(`edit_modal_${productId}`).close();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update product";
      toast.error(errorMsg);
      console.error("Product update error:", error);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    document.getElementById("delete_product_modal").showModal();
  };

  const confirmProductDelete = async () => {
    try {
      await deleteProduct(productToDelete?._id);
      document.getElementById("delete_product_modal").close();
      setProductToDelete(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to delete product";
      toast.error(errorMsg);
      console.error("Product deletion error:", error);
    }
  };

  return (
    <div className="bg-base-200 container mx-auto mt-10 mb-20 max-w-6xl rounded-lg p-5 shadow-md">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock Count</th>
              <th>Discount Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr className="" key={product._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-square h-12 w-12 rounded-md">
                        <img src={product?.image} alt={product?.modelNo} />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{product?.modelNo}</div>
                      <div className="text-sm opacity-50">
                        {product?.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  ৳{product?.price} <br />
                  <span className="badge badge-ghost badge-sm text-red-600">
                    ৳{product?.discountPrice || "N/A"}
                  </span>
                </td>
                <td>{product?.stock}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={product?.onDiscount}
                    className={`toggle ${
                      product?.onDiscount ? "toggle-success" : "toggle-accent"
                    }`}
                    onClick={() =>
                      document
                        .getElementById(`discount_modal_${product._id}`)
                        .showModal()
                    }
                    readOnly
                  />
                </td>
                <td className="flex h-full items-center gap-2">
                  <button
                    className="btn btn-outline btn-success mr-2"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products?.map((product) => (
        <div key={`dialogs-${product._id}`}>
          <dialog
            id={`discount_modal_${product._id}`}
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
                      id={`discount-price-${product._id}`}
                      defaultValue={
                        product?.discountPrice ||
                        Math.floor(product?.price * 0.9)
                      }
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
                        id={`discount-start-${product._id}`}
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    </label>

                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text mb-1">End Date</span>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        id={`discount-end-${product._id}`}
                        defaultValue={
                          new Date(
                            new Date().setMonth(new Date().getMonth() + 1),
                          )
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <p className="py-4">
                  Are you sure you want to remove the discount for{" "}
                  {product?.modelNo}?
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
                            `discount-price-${product._id}`,
                          ).value;
                          const startDate = document.getElementById(
                            `discount-start-${product._id}`,
                          ).value;
                          const endDate = document.getElementById(
                            `discount-end-${product._id}`,
                          ).value;

                          handleDiscountToggle(product, {
                            discountPrice,
                            discountStartDate: startDate,
                            discountEndDate: endDate,
                          });
                        } else {
                          handleDiscountToggle(product);
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

          <dialog
            id={`edit_modal_${product._id}`}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="text-lg font-bold">
                Edit Product: {product?.modelNo}
              </h3>
              <div className="space-y-4 py-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Model Number</span>
                  </div>
                  <input
                    type="text"
                    name="modelNo"
                    placeholder="Model Number"
                    className="input input-bordered w-full"
                    value={editFormData.modelNo || ""}
                    onChange={handleEditChange}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Category</span>
                    </div>
                    <select
                      name="category"
                      className="select select-bordered w-full"
                      value={editFormData.category || ""}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      {editFormData.category &&
                        !categoryOptions.includes(editFormData.category) && (
                          <option value={editFormData.category}>
                            {editFormData.category}
                          </option>
                        )}
                    </select>
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Brand</span>
                    </div>
                    <select
                      name="brand"
                      className="select select-bordered w-full"
                      value={editFormData.brand || ""}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>
                        Select a brand
                      </option>
                      {brandOptions.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                      {editFormData.brand &&
                        !brandOptions.includes(editFormData.brand) && (
                          <option value={editFormData.brand}>
                            {editFormData.brand}
                          </option>
                        )}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Price</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      className="input input-bordered w-full"
                      min="0"
                      value={editFormData.price || 0}
                      onChange={handleEditChange}
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Stock</span>
                    </div>
                    <input
                      type="number"
                      name="stock"
                      className="input input-bordered w-full"
                      min="0"
                      value={editFormData.stock || 0}
                      onChange={handleEditChange}
                    />
                  </label>
                </div>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Color</span>
                  </div>
                  <select
                    name="color"
                    className="select select-bordered w-full"
                    value={editFormData.color || ""}
                    onChange={handleEditChange}
                  >
                    <option value="" disabled>
                      Select a color
                    </option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                    {editFormData.color &&
                      !colorOptions.includes(editFormData.color) && (
                        <option value={editFormData.color}>
                          {editFormData.color}
                        </option>
                      )}
                  </select>
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    name="description"
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    value={editFormData.description || ""}
                    onChange={handleEditChange}
                  ></textarea>
                </label>
              </div>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-outline mr-2">Cancel</button>

                  {loading ? (
                    <span className="loading loading-spinner loading-xl text-success" />
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => handleProductUpdate(product._id)}
                    >
                      Save Changes
                    </button>
                  )}
                </form>
              </div>
            </div>
          </dialog>
        </div>
      ))}

      <dialog
        id="delete_product_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-error text-lg font-bold">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.modelNo}</strong>? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
              {loading ? (
                <span className="loading loading-spinner loading-xl text-error" />
              ) : (
                <button
                  className="btn btn-error"
                  onClick={confirmProductDelete}
                >
                  Delete Product
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductsList;
