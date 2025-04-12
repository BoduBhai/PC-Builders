import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set to visible if the element is intersecting
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (cardRef.current) {
      const currentRef = cardRef.current;
      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Calculate savings percentage for discounted products
  const savingsPercentage = product.onDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  return (
    <div
      ref={cardRef}
      className={`card bg-base-100 shadow-xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } hover:-translate-y-2 hover:shadow-2xl`}
    >
      <figure className="relative h-56 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
        )}

        {product.onDiscount && (
          <div className="absolute top-0 left-0 z-10 bg-red-500 px-2 py-1 font-semibold text-white">
            {savingsPercentage}% OFF
          </div>
        )}

        <img
          src={product.image}
          alt={product.modelNo || product.title}
          className={`h-full w-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </figure>

      <div className="card-body">
        <h3 className="card-title line-clamp-1 text-base">
          {product.title || product.modelNo}
        </h3>
        <p className="line-clamp-2 text-sm opacity-75">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span
              className={`text-xl font-bold ${product.onDiscount ? "text-red-500" : ""}`}
            >
              ${product.onDiscount ? product.discountPrice : product.price}
            </span>
            {product.onDiscount && (
              <span className="text-sm line-through opacity-60">
                ${product.price}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="badge badge-success">In Stock</span>
          ) : (
            <span className="badge badge-error">Out of Stock</span>
          )}
        </div>

        <div className="card-actions mt-2">
          <button className="btn btn-sm btn-success" disabled={!product.stock}>
            Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="btn btn-sm btn-outline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
