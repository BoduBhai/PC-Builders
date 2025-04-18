import React, { useState } from "react";
import {
  categoryOptions,
  brandOptions,
  colorOptions,
} from "../../../utils/constants";

/**
 * Modal component for editing product details
 */
const EditProductModal = ({ product, loading, onSave }) => {
  const [editFormData, setEditFormData] = useState({
    category: product?.category || "",
    modelNo: product?.modelNo || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    brand: product?.brand || "",
    color: product?.color || "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  if (!product) return null;

  return (
    <dialog
      id={`edit_modal_${product?._id}`}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">Edit Product: {product?.modelNo}</h3>
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
              value={editFormData.modelNo}
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
                value={editFormData.category}
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
                value={editFormData.brand}
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
                value={editFormData.price}
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
                value={editFormData.stock}
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
              value={editFormData.color}
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
              value={editFormData.description}
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
                onClick={() => onSave(product._id, editFormData)}
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditProductModal;
