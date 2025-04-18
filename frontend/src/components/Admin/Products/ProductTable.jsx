import React, { useState, useEffect } from "react";
import { Trash, Package, Search, Filter } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner";
import { categoryOptions, brandOptions } from "../../../utils/constants";

/**
 * Component to display products table with similar styling to OrdersTable
 */
const ProductTable = ({
  products,
  loading,
  onEditClick,
  onDeleteClick,
  onDiscountToggleClick,
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Apply filters whenever products or filter values change
  useEffect(() => {
    if (!products) return;

    const filtered = products.filter((product) => {
      // Search term filter
      const searchMatch =
        searchTerm === "" ||
        product.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;

      // Brand filter
      const brandMatch =
        selectedBrand === "All" ||
        (product.brand && product.brand === selectedBrand);

      return searchMatch && categoryMatch && brandMatch;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedBrand("All");
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="card bg-base-100 border-base-300 border shadow-xl">
      <div className="card-body p-0">
        <div className="bg-base-200 border-base-300 flex flex-col items-center justify-between gap-3 border-b p-3 md:flex-row">
          <h2 className="text-lg font-semibold">Products List</h2>

          {/* Search and filter controls */}
          <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
            <div className="relative flex w-full items-center md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered input-sm w-full pr-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400"
                size={16}
              />
            </div>

            <button
              className="btn btn-sm btn-outline gap-2"
              onClick={toggleFilters}
            >
              <Filter size={16} />
              {isFilterOpen ? "Hide Filters" : "Filters"}
            </button>
          </div>
        </div>

        {/* Filter panel with transition */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-base-100 border-base-300 flex flex-col gap-3 border-b p-3 md:flex-row">
            <div className="form-control w-full md:w-1/3">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="All">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full md:w-1/3">
              <label className="label">
                <span className="label-text font-medium">Brand</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedBrand}
                onChange={handleBrandChange}
              >
                <option value="All">All Brands</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2 flex w-full items-end md:w-1/3">
              <button
                className="btn btn-sm w-full"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "65vh",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
          }}
        >
          <div className="overflow-x-auto">
            <table className="table-zebra table-pin-rows table-pin-cols table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="min-w-[250px]">Product</th>
                  <th className="min-w-[150px]">Price</th>
                  <th className="min-w-[120px]">Stock Count</th>
                  <th className="min-w-[150px]">Discount Status</th>
                  <th className="min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr className="hover" key={product._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-square h-12 w-12 rounded-md">
                              <img
                                src={product?.image}
                                alt={product?.modelNo}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">
                              {product?.modelNo}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product?.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">৳{product?.price}</div>
                        {product?.discountPrice && (
                          <div className="text-xs text-red-600">
                            ৳{product?.discountPrice}
                          </div>
                        )}
                      </td>
                      <td>{product?.stock}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={product?.onDiscount}
                            className={`toggle ${
                              product?.onDiscount
                                ? "toggle-success"
                                : "toggle-accent"
                            }`}
                            onClick={() => onDiscountToggleClick(product)}
                            readOnly
                          />
                          <span
                            className={`badge ${
                              product?.onDiscount
                                ? "badge-success"
                                : "badge-ghost"
                            }`}
                          >
                            {product?.onDiscount ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline btn-success"
                            onClick={() => onEditClick(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-circle btn-ghost text-red-500 hover:text-red-700"
                            onClick={() => onDeleteClick(product)}
                            title="Delete Product"
                          >
                            <Trash className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      {loading ? (
                        <LoadingSpinner size="md" />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Package size={40} className="mb-2 text-gray-400" />
                          <p>No products found</p>
                          {(searchTerm ||
                            selectedCategory !== "All" ||
                            selectedBrand !== "All") && (
                            <button
                              className="btn btn-ghost btn-sm mt-2"
                              onClick={handleClearFilters}
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
