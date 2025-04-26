import { lazy, Suspense } from "react";
import { CartIcon } from "../icons";
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
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loadingSkeletons}
        </section>
      ) : products && products.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
              <ProductCard product={product} />
            </Suspense>
          ))}
        </section>
      ) : (
        <section className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <CartIcon className="mb-4 h-12 w-12 opacity-50" />
          <h3 className="mb-2 text-lg font-semibold">{emptyStateMessage}</h3>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="btn btn-outline btn-sm mt-2"
            >
              Clear Filters
            </button>
          )}
        </section>
      )}
    </div>
  );
};

export default ProductGrid;
