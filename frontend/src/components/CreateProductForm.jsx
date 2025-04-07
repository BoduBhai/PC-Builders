import { useState } from "react";
import { Upload, CheckCheck } from "lucide-react";

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

  const { createProduct, loading } = useProductStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct({ ...newProduct, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProduct(newProduct);
    try {
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
    } catch (error) {
      console.error("Error resetting form:", error);
    }
  };

  return (
    <div className="bg-base-200 container mx-auto mt-10 mb-20 max-w-6xl rounded-lg p-5 shadow-md">
      <h2 className="text-center text-xl font-bold">Create New Product</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Category</legend>
          <select
            value={newProduct.category}
            className="select"
            required
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
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
        </fieldset>

        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Model Number</legend>
          <input
            type="text"
            className="input border-base-300 h-14 w-full border-2"
            placeholder="Enter model number"
            value={newProduct.modelNo}
            onChange={(e) =>
              setNewProduct({ ...newProduct, modelNo: e.target.value })
            }
          />
        </fieldset>
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            className="textarea border-base-300 h-24 w-full border-2"
            placeholder="Description of the product..."
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </fieldset>
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Price</legend>
          <input
            type="number"
            className="input border-base-300 h-14 w-full border-2"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
        </fieldset>
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">Stock</legend>
          <input
            type="number"
            className="input border-base-300 h-14 w-full border-2"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
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
          {/* <span className="fieldset-label">Optional</span> */}
        </fieldset>
        <fieldset className="fieldset text-lg">
          <legend className="fieldset-legend">
            Upload image
            <Upload className="inline-block size-5" />
          </legend>
          <input
            type="file"
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label className="fieldset-label text-sm">Max size 2MB</label>
          {newProduct.image && (
            <span className="fieldset-label text-secondary text-md">
              Image uploaded Successfully <CheckCheck size="20" />
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
