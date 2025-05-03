import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../../stores/useProductStore";
import { categoryOptions, brandOptions } from "../../utils/constants";
import { Search, X, SlidersHorizontal, Filter, ChevronUp } from "lucide-react";

import ProductGrid from "../../components/ui/ProductGrid";
import Pagination from "../../components/ui/pagination/Pagination";

const DiscountedProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const { discountedProducts, fetchDiscountedProducts, loading } =
    useProductStore();

  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All",
  );
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState("default");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch all discounted products at once for client-side filtering
  useEffect(() => {
    fetchDiscountedProducts();
  }, [fetchDiscountedProducts]);

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
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [categoryParam, searchParam]);

  // Filter products based on search term, category, brand, and price range
  const filteredProducts = discountedProducts?.filter((product) => {
    // Search term filter
    const searchMatch =
      searchTerm === "" ||
      product.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    // Brand filter
    const brandMatch =
      selectedBrand === "All" ||
      (product.brand && product.brand === selectedBrand);

    // Price range filter
    const priceMatch =
      (priceRange.min === "" ||
        product.discountPrice >= Number(priceRange.min)) &&
      (priceRange.max === "" ||
        product.discountPrice <= Number(priceRange.max));

    return searchMatch && categoryMatch && brandMatch && priceMatch;
  });

  // Sort products based on selected option
  const sortedProducts = filteredProducts?.slice().sort((a, b) => {
    switch (sortOption) {
      case "price_low":
        return a.discountPrice - b.discountPrice;
      case "price_high":
        return b.discountPrice - a.discountPrice;
      case "discount_percent":
        return (
          Math.round(((b.price - b.discountPrice) / b.price) * 100) -
          Math.round(((a.price - a.discountPrice) / a.price) * 100)
        );
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Calculate pagination values
  const totalFilteredProducts = filteredProducts?.length || 0;
  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

  // Get current page's products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts?.slice(
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value !== "All") {
      searchParams.set("category", e.target.value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
    setCurrentPage(1); // Reset to first page when changing filters
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
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange({ min: "", max: "" });
    searchParams.delete("category");
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-base-200 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold">
            Special Offers
          </h1>
          <p className="mb-8 text-center text-lg">
            Explore all our discounted PC components and save big!
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-base-100 mx-auto mb-8 flex max-w-2xl items-center rounded-lg px-3 shadow-md transition-all duration-300 focus-within:shadow-lg"
            role="search"
          >
            <Search className="mr-2 size-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for products..."
              className="input flex-1 border-0 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search for products"
            />
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm"
              onClick={toggleFilters}
              aria-label="Toggle filters"
              aria-expanded={isFilterOpen}
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </form>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        {/* Filter Toggle Button for Mobile/Tablet - Fixed Position */}
        <button
          onClick={toggleFilters}
          className="btn btn-primary btn-sm fixed bottom-6 left-6 z-30 flex gap-2 shadow-lg md:hidden"
          aria-label="Toggle filters"
          aria-expanded={isFilterOpen}
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
              aria-expanded={isFilterOpen}
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
                aria-label="Sort products by"
              >
                <option value="default">Default sorting</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount_percent">Biggest Discount</option>
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
                aria-label="Products per page"
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
          <aside
            className={`transform transition-all duration-300 ease-in-out ${
              isFilterOpen
                ? "max-h-[2000px] opacity-100 lg:w-1/4"
                : "max-h-0 overflow-hidden opacity-0 lg:max-h-0 lg:w-0 lg:overflow-hidden lg:opacity-0"
            } bg-base-100 rounded-box sticky top-20 z-10 h-fit p-4 shadow-md`}
            aria-hidden={!isFilterOpen}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                className="btn btn-circle btn-ghost btn-sm"
                onClick={toggleFilters}
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="divide-base-300 mb-6 space-y-4 divide-y">
              <div className="pb-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Category</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    aria-label="Filter by category"
                  >
                    <option value="All">All Categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="py-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Brand</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    aria-label="Filter by brand"
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
                    aria-label="Minimum price"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    className="input input-bordered w-full"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    aria-label="Maximum price"
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
          </aside>

          <ProductGrid
            products={currentProducts}
            loading={loading}
            itemsPerPage={itemsPerPage}
            isFilterOpen={isFilterOpen}
            emptyStateMessage="No discounted products found"
            onClearFilters={handleClearFilters}
          />
        </div>

        {totalFilteredProducts > 0 && (
          <nav aria-label="Pagination" className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </nav>
        )}
      </section>

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
    </main>
  );
};

export default DiscountedProductsPage;
