import { useState } from "react";
import { Upload, CheckCheck, AlertCircle } from "lucide-react";

import {
  categoryOptions,
  brandOptions,
  colorOptions,
} from "../utils/constants";
import { useProductStore } from "../stores/useProductStore";

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    category: "",
    modelNo: "",
    description: "",
    price: 0,
    stock: 0,
    image: null,
    brand: "",
    color: "",
    onDiscount: false,
    discountPrice: 0,
    discountStartDate: "",
    discountEndDate: "",
  });

  const [errors, setErrors] = useState({});
  const [submitFeedback, setSubmitFeedback] = useState({
    type: "",
    message: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 2MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
        setErrors({ ...errors, image: null });
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct({ ...newProduct, image: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newProduct.category) newErrors.category = "Category is required";
    if (!newProduct.modelNo) newErrors.modelNo = "Model number is required";
    if (!newProduct.description || newProduct.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (newProduct.price <= 0) newErrors.price = "Price must be greater than 0";
    if (newProduct.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!newProduct.image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset any previous submission feedback
    setSubmitFeedback({ type: "", message: "" });

    // Validate form before submission
    if (!validateForm()) return;

    try {
      await createProduct(newProduct);
      setSubmitFeedback({
        type: "success",
        message: "Product created successfully!",
      });

      // Reset form
      setNewProduct({
        category: "",
        modelNo: "",
        description: "",
        price: 0,
        stock: 0,
        image: null,
        brand: "",
        color: "",
        onDiscount: false,
        discountPrice: 0,
        discountStartDate: "",
        discountEndDate: "",
      });
      setErrors({});
    } catch (error) {
      setSubmitFeedback({
        type: "error",
        message: error?.response?.data?.message || "Failed to create product",
      });
    }
  };

  return (
    <div className="container mx-auto mb-20 max-w-6xl rounded-lg p-5 shadow-md">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Create New Product
      </h2>

      {/* Submission feedback alert */}
      {submitFeedback.message && (
        <div
          className={`alert ${submitFeedback.type === "success" ? "alert-success" : "alert-error"} mt-2 mb-4`}
        >
          {submitFeedback.type === "success" ? (
            <CheckCheck className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{submitFeedback.message}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-base-200 mt-5 space-y-4 rounded-lg p-5 shadow-md"
      >
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Category</legend>
          <select
            value={newProduct.category}
            className={`select w-full ${errors.category ? "border-error border-2" : ""}`}
            required
            onChange={(e) => {
              setNewProduct({ ...newProduct, category: e.target.value });
              if (errors.category) setErrors({ ...errors, category: null });
            }}
          >
            <option value="" disabled>
              Select a category{" "}
            </option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-error mt-1 text-sm">{errors.category}</span>
          )}
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Model Number</legend>
          <input
            type="text"
            className={`input border-base-300 h-14 w-full border-2 ${errors.modelNo ? "border-error" : ""}`}
            placeholder="Enter model number"
            value={newProduct.modelNo}
            onChange={(e) => {
              setNewProduct({ ...newProduct, modelNo: e.target.value });
              if (errors.modelNo) setErrors({ ...errors, modelNo: null });
            }}
          />
          {errors.modelNo && (
            <span className="text-error mt-1 text-sm">{errors.modelNo}</span>
          )}
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            className={`textarea border-base-300 h-24 w-full border-2 ${errors.description ? "border-error" : ""}`}
            placeholder="Description of the product..."
            value={newProduct.description}
            onChange={(e) => {
              setNewProduct({ ...newProduct, description: e.target.value });
              if (errors.description)
                setErrors({ ...errors, description: null });
            }}
          />
          {errors.description && (
            <span className="text-error mt-1 text-sm">
              {errors.description}
            </span>
          )}
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Price</legend>
          <input
            type="number"
            className={`input border-base-300 h-14 w-full border-2 ${errors.price ? "border-error" : ""}`}
            value={newProduct.price}
            onChange={(e) => {
              setNewProduct({ ...newProduct, price: Number(e.target.value) });
              if (errors.price) setErrors({ ...errors, price: null });
            }}
          />
          {errors.price && (
            <span className="text-error mt-1 text-sm">{errors.price}</span>
          )}
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Stock</legend>
          <input
            type="number"
            className={`input border-base-300 h-14 w-full border-2 ${errors.stock ? "border-error" : ""}`}
            value={newProduct.stock}
            onChange={(e) => {
              setNewProduct({ ...newProduct, stock: Number(e.target.value) });
              if (errors.stock) setErrors({ ...errors, stock: null });
            }}
          />
          {errors.stock && (
            <span className="text-error mt-1 text-sm">{errors.stock}</span>
          )}
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Brand</legend>
          <select
            value={newProduct.brand}
            onChange={(e) =>
              setNewProduct({ ...newProduct, brand: e.target.value })
            }
            className="select"
          >
            <option value="" disabled>
              Select a brand{" "}
            </option>
            {brandOptions.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Color</legend>
          <select
            value={newProduct.color}
            onChange={(e) =>
              setNewProduct({ ...newProduct, color: e.target.value })
            }
            className="select"
          >
            <option value="" disabled>
              Select a color{" "}
            </option>
            {colorOptions.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">
            Upload image
            <Upload className="inline-block size-5" />
          </legend>
          <input
            type="file"
            className={`file-input ${errors.image ? "border-error" : ""}`}
            accept="image/*"
            onChange={handleImageChange}
          />
          <label className="fieldset-label text-sm">Max size 2MB</label>
          {newProduct.image && (
            <span className="fieldset-label text-secondary text-md">
              Image uploaded Successfully <CheckCheck size="20" />
            </span>
          )}
          {errors.image && (
            <span className="text-error mt-1 block text-sm">
              {errors.image}
            </span>
          )}
        </fieldset>

        <button
          type="submit"
          className="btn btn-success btn-block font-semibold"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xl text-success" />
          ) : (
            <span className="font-semibold">Create Product</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
