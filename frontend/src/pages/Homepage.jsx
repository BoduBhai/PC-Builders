import { useEffect, lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { useProductStore } from "../stores/useProductStore";

import { featuredCategories } from "../utils/constants";
import { ProductCardSkeleton } from "../components/Skeletons/ProductCardSkeleton";
const ProductCard = lazy(() => import("../components/ui/ProductCard"));

const HomePage = () => {
  const MAX_HOMEPAGE_PRODUCTS = 6;
  const INITIAL_CATEGORIES_TO_SHOW = 4;

  const { discountedProducts, fetchDiscountedProducts, loading } =
    useProductStore();

  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleCategoriesView = () => {
    setShowAllCategories(!showAllCategories);
  };

  useEffect(() => {
    fetchDiscountedProducts();
  }, [fetchDiscountedProducts]);

  // Only display up to MAX_HOMEPAGE_PRODUCTS
  const visibleProducts = discountedProducts?.slice(0, MAX_HOMEPAGE_PRODUCTS);
  const hasMoreProducts = discountedProducts?.length > MAX_HOMEPAGE_PRODUCTS;

  return (
    <main className="min-h-screen">
      <section className="hero bg-base-200 min-h-[80vh]">
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
              <Link to={"/build-pc"}>
                <button className="btn btn-outline">Build a PC</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Popular Categories
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories
              .slice(0, INITIAL_CATEGORIES_TO_SHOW)
              .map((category, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl"
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

          {/* Animated expandable categories with Framer Motion */}
          <AnimatePresence>
            {showAllCategories && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {featuredCategories
                    .slice(INITIAL_CATEGORIES_TO_SHOW)
                    .map((category, index) => (
                      <Motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
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
                          <p className="text-sm opacity-75">
                            {category.description}
                          </p>
                          <div className="card-actions mt-4 justify-end">
                            <Link
                              to={`/category/${category.name}`}
                              className="btn btn-sm btn-primary"
                            >
                              Browse {category.name}
                            </Link>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          <div className="relative mt-8 flex justify-center">
            <Motion.button
              className="btn btn-outline z-10 flex items-center gap-2 transition-colors duration-300 hover:scale-105"
              onClick={toggleCategoriesView}
              initial={false}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {showAllCategories ? (
                <>
                  <ChevronUp className="transition-transform duration-300" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="transition-transform duration-300" />
                  Show More
                </>
              )}
            </Motion.button>
          </div>
        </div>
      </section>

      {/* Discounted Products Section */}
      <section className="bg-base-200 py-16">
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
      </section>
    </main>
  );
};

export default HomePage;
