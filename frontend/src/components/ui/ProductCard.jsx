import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import ResponsiveImage from "./ResponsiveImage";

const ProductCard = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const cardRef = useRef(null);

  const { addToCart, cart } = useCartStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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

  // Check if product is already in cart
  const isInCart = cart.items.some((item) => item.product._id === product._id);

  // Get current quantity in cart if product exists
  const existingItem = cart.items.find(
    (item) => item.product._id === product._id,
  );
  const currentQuantity = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = async () => {
    if (!product.stock) {
      toast.error("This product is out of stock");
      return;
    }

    // If product is already in cart, show a different message
    if (isInCart) {
      toast.success(
        <div>
          Already in cart ({currentQuantity})<br />
          <Link to="/cart" className="text-primary underline">
            View Cart
          </Link>
        </div>,
        { duration: 4000 },
      );
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

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
        {product.onDiscount && (
          <div className="roun rounded-br-box absolute top-0 left-0 z-10 bg-red-500 px-2 py-1 font-semibold text-white">
            {savingsPercentage}% OFF
          </div>
        )}

        <ResponsiveImage
          src={product.image}
          alt={product.modelNo || product.title}
          width={280}
          height={224}
          objectFit="contain"
          className="h-full w-full"
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
              ৳{product.onDiscount ? product.discountPrice : product.price}
            </span>
            {product.onDiscount ? (
              <span className="text-sm line-through opacity-60">
                ৳{product.price}
              </span>
            ) : (
              <span className="invisible text-sm">Placeholder</span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="badge badge-success">In Stock</span>
          ) : (
            <span className="badge badge-error">Out of Stock</span>
          )}
        </div>

        <div className="card-actions mt-2">
          {isInCart ? (
            <Link to="/cart" className="btn btn-sm btn-outline btn-success">
              <Eye size={16} /> View in Cart ({currentQuantity})
            </Link>
          ) : (
            <button
              className="btn btn-sm btn-success"
              disabled={!product.stock || addingToCart}
              onClick={handleAddToCart}
            >
              {addingToCart ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to Cart
                </>
              )}
            </button>
          )}
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
