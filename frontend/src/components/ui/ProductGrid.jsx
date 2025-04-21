import { lazy, Suspense } from "react";

import { ProductCardSkeleton } from ".././Skeletons/ProductCardSkeleton";

const ProductCard = lazy(() => import("./ProductCard"));

const ProductGrid = ({
  products = [],
  loading = false,
  itemsPerPage = 8,
  isFilterOpen = false,
  emptyStateMessage = "No products found",
  onClearFilters,
}) => {
  // Generate loading skeletons based on itemsPerPage
  const loadingSkeletons = Array(itemsPerPage)
    .fill()
    .map((_, index) => <ProductCardSkeleton key={index} />);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isFilterOpen ? "lg:w-3/4 lg:pl-6" : "w-full"
      }`}
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loadingSkeletons}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
              <ProductCard product={product} />
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4 h-12 w-12 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold">{emptyStateMessage}</h3>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="btn btn-outline btn-sm mt-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
