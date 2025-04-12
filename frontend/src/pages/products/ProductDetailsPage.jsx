import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
// Removed Share2 import
import { toast } from "react-hot-toast";

import { useProductStore } from "../../stores/useProductStore";
import { formatDate } from "../../utils/dateUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProductCard from "../../components/ui/ProductCard";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const {
    fetchProductById,
    fetchSimilarProducts,
    loading,
    currentProduct,
    similarProducts,
  } = useProductStore();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id);
        // Once we have the product, fetch similar products from the same category
        if (product && product.category) {
          await fetchSimilarProducts(id, product.category);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        navigate("/products");
      }
    };

    loadProduct();
  }, [id, fetchProductById, fetchSimilarProducts, navigate]);

  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth < 640) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(4);
      }
    };

    // Initial calculation
    updateVisibleSlides();

    // Update on window resize
    window.addEventListener("resize", updateVisibleSlides);

    return () => {
      window.removeEventListener("resize", updateVisibleSlides);
    };
  }, []);

  const handleAddToCart = () => {
    if (!currentProduct?.stock) return;

    setAddingToCart(true);
    setTimeout(() => {
      toast.success(`${currentProduct?.modelNo || "Product"} added to cart!`);
      setAddingToCart(false);
    }, 800);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? "Removed from wishlist"
        : `${currentProduct?.modelNo} added to wishlist!`,
    );
  };

  const savingsAmount = currentProduct?.onDiscount
    ? currentProduct.price - currentProduct.discountPrice
    : 0;

  const savingsPercentage = currentProduct?.onDiscount
    ? Math.round((savingsAmount / currentProduct.price) * 100)
    : 0;

  // Slider navigation functions
  const scrollLeft = () => {
    if (!sliderRef.current) return;

    const itemWidth = sliderRef.current.clientWidth / visibleSlides;
    sliderRef.current.scrollBy({
      left: -itemWidth * visibleSlides,
      behavior: "smooth",
    });

    setSliderPosition(Math.max(0, sliderPosition - 1));
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;

    const itemWidth = sliderRef.current.clientWidth / visibleSlides;
    sliderRef.current.scrollBy({
      left: itemWidth * visibleSlides,
      behavior: "smooth",
    });

    const maxPosition = Math.ceil(similarProducts.length / visibleSlides) - 1;
    setSliderPosition(Math.min(maxPosition, sliderPosition + 1));
  };

  if (loading) return <LoadingSpinner />;

  if (!currentProduct)
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-[70px]">
        <div className="bg-base-200 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Product not found</h2>
        <p className="text-base-content/60 mb-6 max-w-md text-center">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );

  const hasEnoughSimilarProducts = similarProducts.length > visibleSlides;

  return (
    <div className="bg-base-100">
      {/* Add padding to prevent content from going under the navbar */}
      <div className="pt-[70px] pb-16">
        <div className="container mx-auto px-4">
          {/* Back button and breadcrumb navigation */}
          <div className="mb-6">
            <nav className="mb-4 flex text-sm">
              <Link to="/" className="text-base-content/60 hover:text-primary">
                Home
              </Link>
              <ChevronRight size={16} className="text-base-content/30 mx-2" />
              <Link
                to="/products"
                className="text-base-content/60 hover:text-primary"
              >
                Products
              </Link>
              <ChevronRight size={16} className="text-base-content/30 mx-2" />
              <Link
                to={`/category/${currentProduct.category}`}
                className="text-base-content/60 hover:text-primary"
              >
                {currentProduct.category}
              </Link>
              <ChevronRight size={16} className="text-base-content/30 mx-2" />
              <span className="max-w-[200px] truncate font-medium">
                {currentProduct.modelNo}
              </span>
            </nav>

            <Link
              to="/products"
              className="hover:text-primary group inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span className="bg-base-200 group-hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full transition-colors">
                <ArrowLeft size={16} />
              </span>
              Back to Products
            </Link>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Product image - 5 columns */}
            <div className="lg:col-span-5">
              <div className="from-base-200 to-base-300 relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br">
                {currentProduct?.onDiscount && (
                  <div className="bg-primary text-primary-content absolute top-5 left-5 rounded-full px-4 py-1.5 text-sm font-bold shadow-lg">
                    {savingsPercentage}% OFF
                  </div>
                )}
                <img
                  src={currentProduct?.image}
                  alt={currentProduct?.modelNo}
                  className="max-h-[80%] max-w-[80%] object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
                />

                {/* Wishlist button placed back on image */}
                <div className="absolute right-5 bottom-5">
                  <button
                    onClick={toggleWishlist}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      isWishlisted
                        ? "bg-red-500 text-white"
                        : "bg-base-100/80 backdrop-blur-sm hover:bg-red-100 hover:text-red-500"
                    }`}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product details - 7 columns */}
            <div className="space-y-8 lg:col-span-7">
              {/* Product header */}
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {currentProduct?.category}
                  </span>
                  <span className="bg-base-200 rounded-full px-3 py-1 text-sm font-medium">
                    {currentProduct?.brand}
                  </span>
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight">
                  {currentProduct?.modelNo}
                </h1>
              </div>

              {/* Price and stock section */}
              <div className="bg-base-100 border-base-200 rounded-2xl border p-6 shadow-sm">
                <div className="flex items-baseline gap-4">
                  {currentProduct?.onDiscount ? (
                    <>
                      <span className="text-primary text-3xl font-bold">
                        ${currentProduct?.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-base-content/50 text-lg line-through">
                        ${currentProduct?.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      ${currentProduct?.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {currentProduct?.onDiscount && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="bg-success/20 rounded-full p-1">
                      <Check size={16} className="text-success" />
                    </div>
                    <p className="text-sm">
                      <span className="text-success font-medium">
                        You save ${savingsAmount.toFixed(2)} (
                        {savingsPercentage}%)
                      </span>
                      <span className="text-base-content/60 mx-1">•</span>
                      <span className="text-base-content/60">
                        Deal ends {formatDate(currentProduct?.discountEndDate)}
                      </span>
                    </p>
                  </div>
                )}

                <div className="border-base-200 my-5 border-t"></div>

                <div className="flex flex-col gap-6">
                  {/* Stock information */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${currentProduct?.stock > 0 ? "bg-success" : "bg-error"}`}
                    ></div>
                    <span>
                      {currentProduct?.stock > 0 ? (
                        <span className="font-medium">
                          In Stock{" "}
                          <span className="text-base-content/60">
                            ({currentProduct?.stock} available)
                          </span>
                        </span>
                      ) : (
                        <span className="text-error font-medium">
                          Out of Stock
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Add to cart button - smaller width */}
                  <div className="flex justify-start">
                    <button
                      className={`rounded-full px-5 py-2 text-center text-sm font-medium transition-all ${
                        currentProduct?.stock > 0 && !addingToCart
                          ? "bg-primary text-primary-content hover:shadow-primary/20 hover:shadow-lg active:scale-[0.98]"
                          : "bg-base-200 text-base-content/50"
                      } `}
                      disabled={!currentProduct?.stock || addingToCart}
                      onClick={handleAddToCart}
                    >
                      {addingToCart ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="loading loading-spinner loading-xs"></span>
                          Adding...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Description and Specs tabs */}
          <div className="mb-16">
            <div className="border-base-200 mb-8 border-b">
              <div className="flex gap-8">
                <button
                  className={`px-1 pb-4 font-medium transition-colors ${
                    selectedTab === "description"
                      ? "border-primary text-primary border-b-2"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                  onClick={() => setSelectedTab("description")}
                >
                  Description
                </button>
                <button
                  className={`px-1 pb-4 font-medium transition-colors ${
                    selectedTab === "specs"
                      ? "border-primary text-primary border-b-2"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                  onClick={() => setSelectedTab("specs")}
                >
                  Specifications
                </button>
              </div>
            </div>

            <div className="bg-base-100 border-base-200 min-h-[200px] rounded-xl border p-6">
              {selectedTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {currentProduct?.description ||
                      "No description available for this product."}
                  </p>
                </div>
              )}

              {selectedTab === "specs" && (
                <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-3">
                  <div>
                    <h3 className="text-base-content/50 mb-2 text-sm uppercase">
                      Category
                    </h3>
                    <p className="font-medium">{currentProduct?.category}</p>
                  </div>

                  <div>
                    <h3 className="text-base-content/50 mb-2 text-sm uppercase">
                      Brand
                    </h3>
                    <p className="font-medium">
                      {currentProduct?.brand || "N/A"}
                    </p>
                  </div>

                  {currentProduct?.color && (
                    <div>
                      <h3 className="text-base-content/50 mb-2 text-sm uppercase">
                        Color
                      </h3>
                      <p className="flex items-center gap-2 font-medium">
                        <span
                          className="h-4 w-4 rounded-full bg-current"
                          style={{ color: currentProduct.color.toLowerCase() }}
                        ></span>
                        {currentProduct.color}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-base-content/50 mb-2 text-sm uppercase">
                      Stock
                    </h3>
                    <p className="font-medium">{currentProduct?.stock} units</p>
                  </div>

                  <div>
                    <h3 className="text-base-content/50 mb-2 text-sm uppercase">
                      Model
                    </h3>
                    <p className="font-medium">{currentProduct?.modelNo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products Section with slider */}
          {similarProducts && similarProducts.length > 0 && (
            <div className="mt-16">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Similar Products</h2>

                {hasEnoughSimilarProducts && (
                  <div className="flex gap-2">
                    <button
                      onClick={scrollLeft}
                      className="btn btn-circle btn-sm border-base-300 bg-base-100 hover:bg-primary hover:text-primary-content hover:border-primary border transition-colors"
                      disabled={sliderPosition === 0}
                    >
                      <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={scrollRight}
                      className="btn btn-circle btn-sm border-base-300 bg-base-100 hover:bg-primary hover:text-primary-content hover:border-primary border transition-colors"
                      disabled={
                        sliderPosition >=
                        Math.ceil(similarProducts.length / visibleSlides) - 1
                      }
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative overflow-hidden">
                <div
                  ref={sliderRef}
                  className="scrollbar-none flex gap-4 overflow-x-auto pb-4"
                  style={{
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {similarProducts.map((product) => (
                    <div
                      key={product._id}
                      className={`w-full flex-shrink-0 flex-grow-0 sm:w-1/2 lg:w-1/4`}
                      style={{ maxWidth: `calc(100% / ${visibleSlides})` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile indicator dots for small screens */}
              {similarProducts.length > 1 && (
                <div className="mt-4 flex justify-center gap-1 lg:hidden">
                  {Array.from({
                    length: Math.ceil(similarProducts.length / visibleSlides),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === sliderPosition ? "bg-primary" : "bg-base-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
