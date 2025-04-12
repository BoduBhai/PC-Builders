import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { brandOptions } from "../utils/constants";
import { Search, X, SlidersHorizontal, ChevronUp, Filter } from "lucide-react";

import ProductGrid from "../components/ui/ProductGrid";
import Pagination from "../components/ui/pagination/Pagination";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search");

  const { fetchProductsByCategory, products, loading } = useProductStore();

  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("default");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch products when category changes
  useEffect(() => {
    fetchProductsByCategory(categoryName);
  }, [categoryName, fetchProductsByCategory]);

  // Monitor scroll position for the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update from URL params
  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  // Filter products based on search term, brand, and price range
  const filteredProducts = products?.filter((product) => {
    // Search term filter
    const searchMatch =
      searchTerm === "" ||
      product.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    // Brand filter
    const brandMatch =
      selectedBrand === "All" ||
      (product.brand && product.brand === selectedBrand);

    // Price range filter
    const priceMatch =
      (priceRange.min === "" ||
        (product.onDiscount
          ? product.discountPrice >= Number(priceRange.min)
          : product.price >= Number(priceRange.min))) &&
      (priceRange.max === "" ||
        (product.onDiscount
          ? product.discountPrice <= Number(priceRange.max)
          : product.price <= Number(priceRange.max)));

    return searchMatch && brandMatch && priceMatch;
  });

  // Sort filtered products
  const filteredAndSortedProducts = filteredProducts?.slice().sort((a, b) => {
    switch (sortOption) {
      case "price_low":
        return (
          (a.onDiscount ? a.discountPrice : a.price) -
          (b.onDiscount ? b.discountPrice : b.price)
        );
      case "price_high":
        return (
          (b.onDiscount ? b.discountPrice : b.price) -
          (a.onDiscount ? a.discountPrice : a.price)
        );
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Calculate pagination values
  const totalFilteredProducts = filteredAndSortedProducts?.length || 0;
  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

  // Get current page's products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredAndSortedProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setPriceRange({ min: "", max: "" });
    searchParams.delete("search");
    setSearchParams(searchParams);
    setCurrentPage(1); // Reset to first page when clearing filters
    setSortOption("default");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Header */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold">
            {categoryName}
          </h1>
          <p className="mb-8 text-center text-lg">
            Browse our selection of {categoryName.toLowerCase()} components
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-base-100 mx-auto mb-8 flex max-w-2xl items-center rounded-lg px-3 shadow-md transition-all duration-300 focus-within:shadow-lg"
          >
            <Search className="mr-2 size-5 text-gray-500" />
            <input
              type="text"
              placeholder={`Search in ${categoryName}...`}
              className="input flex-1 border-0 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm"
              onClick={toggleFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Toggle Button for Mobile/Tablet - Fixed Position */}
        <button
          onClick={toggleFilters}
          className="btn btn-primary btn-sm fixed bottom-6 left-6 z-30 flex gap-2 shadow-lg md:hidden"
        >
          <Filter size={16} />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Desktop Filter Toggle & Sort Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFilters}
              className="btn btn-sm hidden items-center gap-2 md:flex"
            >
              {isFilterOpen ? (
                <>
                  <X size={16} />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter size={16} />
                  Show Filters
                </>
              )}
            </button>
            <p className="text-lg">
              <span className="font-semibold">{totalFilteredProducts}</span>{" "}
              products found
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm font-medium">
                Sort by{" "}
              </label>
              <select
                id="sort"
                className="select select-bordered select-sm"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="default">Default sorting</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="perPage" className="mr-2 text-sm font-medium">
                Show
              </label>
              <select
                id="perPage"
                className="select select-bordered select-sm"
                value={itemsPerPage}
                onChange={handlePerPageChange}
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Filters Section */}
          <div
            className={`transform transition-all duration-300 ease-in-out ${
              isFilterOpen
                ? "max-h-[2000px] opacity-100 lg:w-1/4"
                : "max-h-0 overflow-hidden opacity-0 lg:max-h-0 lg:w-0 lg:overflow-hidden lg:opacity-0"
            } bg-base-100 rounded-box sticky top-20 z-10 h-fit p-4 shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                className="btn btn-circle btn-ghost btn-sm"
                onClick={toggleFilters}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="divide-base-300 mb-6 space-y-4 divide-y">
              <div className="py-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Brand</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
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
                </label>
              </div>

              <div className="py-4">
                <div className="label">
                  <span className="label-text font-medium">Price Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    className="input input-bordered w-full"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    className="input input-bordered w-full"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="btn btn-outline btn-block"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={currentProducts}
            loading={loading}
            itemsPerPage={itemsPerPage}
            isFilterOpen={isFilterOpen}
            emptyStateMessage={`No ${categoryName} products found matching your criteria`}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Pagination */}
        {totalFilteredProducts > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>

      {/* Scroll to top button */}
      <button
        className={`btn btn-circle btn-primary fixed right-6 bottom-6 shadow-lg transition-all duration-300 ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default CategoryPage;
