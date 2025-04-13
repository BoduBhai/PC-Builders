import { useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import { useProductStore } from "../stores/useProductStore";
import { featuredCategories } from "../utils/constants";

const ProductCard = lazy(() => import("../components/ui/ProductCard"));

// Skeleton loading component for products
const ProductCardSkeleton = () => (
  <div className="card bg-base-100 animate-pulse shadow-xl">
    <div className="h-56 bg-gray-300"></div>
    <div className="card-body">
      <div className="mb-2 h-4 w-3/4 bg-gray-300"></div>
      <div className="mb-4 h-4 w-1/2 bg-gray-300"></div>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-1/4 bg-gray-300"></div>
      </div>
      <div className="card-actions mt-2 flex gap-2">
        <div className="h-8 w-24 rounded bg-gray-300"></div>
        <div className="h-8 w-24 rounded bg-gray-300"></div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  // Limit to display only a few products on homepage
  const MAX_HOMEPAGE_PRODUCTS = 6;
  const { discountedProducts, fetchDiscountedProducts, loading } =
    useProductStore();

  useEffect(() => {
    fetchDiscountedProducts();
  }, [fetchDiscountedProducts]);

  // Only display up to MAX_HOMEPAGE_PRODUCTS
  const visibleProducts = discountedProducts?.slice(0, MAX_HOMEPAGE_PRODUCTS);
  const hasMoreProducts = discountedProducts?.length > MAX_HOMEPAGE_PRODUCTS;

  return (
    <div className="min-h-screen pt-[61px]">
      <div className="hero bg-base-200 min-h-[70vh]">
        <div className="hero-content flex-col gap-12 lg:flex-row-reverse">
          <img
            src="/hero-image.avif"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="PC Build"
            width="384"
            height="288"
            loading="eager"
          />
          <div>
            <h1 className="text-5xl font-bold">Build Your Dream PC Today!</h1>
            <p className="py-6">
              Get started with the best components for your custom PC build.
              From high-performance gaming rigs to professional workstations, we
              have everything you need.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={"/products"}>
                <button className="btn btn-primary">Shop Components</button>
              </Link>
              <button className="btn btn-outline">Build a PC</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl transition-all hover:shadow-2xl"
              >
                <figure className="h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    width="300"
                    height="192"
                    loading="lazy"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{category.name}</h3>
                  <p className="text-sm opacity-75">{category.description}</p>
                  <div className="card-actions mt-4 justify-end">
                    <Link
                      to={`/category/${category.name}`}
                      className="btn btn-sm btn-primary"
                    >
                      Browse {category.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discounted Products Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Special Offers
          </h2>
          <p className="mb-8 text-center text-lg">
            Limited time discounts on our best PC components!
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Show skeletons when loading
              Array(6)
                .fill()
                .map((_, index) => <ProductCardSkeleton key={index} />)
            ) : visibleProducts && visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
                  <ProductCard product={product} />
                </Suspense>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl">No discounted products found</h3>
                <p className="mt-2 text-gray-500">
                  Check back soon for our newest offers!
                </p>
              </div>
            )}
          </div>

          {/* Link to view all discounted products when there are more */}
          {hasMoreProducts && (
            <div className="mt-12 flex justify-center">
              <Link
                to="/discounted-products"
                className="btn btn-primary btn-wide"
              >
                View All Discounted Products
              </Link>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link
              to="/products"
              className="group flex flex-col items-center transition-all hover:scale-105 hover:transform"
            >
              <p className="mb-3 text-center text-lg">
                Can't find what you're looking for?
              </p>
              <div className="text-primary flex items-center gap-2 font-medium">
                <span>Browse All Products</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Promo Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title text-2xl">Special Discounts!</h2>
                <p>
                  Get up to 30% off on selected products. Limited time offer.
                </p>
                <div className="card-actions justify-end">
                  <button className="btn">Shop Now</button>
                </div>
              </div>
            </div>
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title text-2xl">Build & Save</h2>
                <p>
                  Buy a complete PC build and get extra 10% discount on your
                  purchase.
                </p>
                <div className="card-actions justify-end">
                  <button className="btn">Configure Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="mt-2 text-gray-500">
              Subscribe to our newsletter to get updates on new products and
              special offers.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
