import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import {
  Trash,
  ShoppingBasket,
  Plus,
  Minus,
  AlertTriangle,
  LogIn,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [processingIds, setProcessingIds] = useState([]);
  const [clearingCart, setClearingCart] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQuantity = currentQty + change;

    if (newQuantity < 1) return;

    setProcessingIds((prev) => [...prev, productId]);

    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleRemoveItem = async (productId) => {
    setProcessingIds((prev) => [...prev, productId]);

    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.success("Please log in to complete your purchase", { icon: "🔒" });
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (loading && !processingIds.length && !cart.items.length) {
    return <LoadingSpinner size="lg" />;
  }

  if (!loading && (!cart.items || cart.items.length === 0)) {
    return (
      <section className="flex min-h-[80vh] flex-col items-center justify-center">
        <ShoppingBasket size={64} className="mb-4 text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="bg-base-200 rounded-xl p-4 lg:w-2/3">
          <header className="mb-4 flex items-center justify-between md:mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">Shopping Cart</h1>
            <button
              className="btn btn-sm btn-error"
              onClick={handleClearCart}
              disabled={clearingCart}
              aria-label="Clear cart contents"
            >
              {clearingCart ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <Trash size={16} className="md:mr-1" />
                  <span className="hidden md:inline">Clear Cart</span>
                </>
              )}
            </button>
          </header>

          <div className="flex flex-col gap-3 md:gap-4">
            {cart.items.map((item) => {
              const isProcessing = processingIds.includes(item.product._id);
              const price = item.product.onDiscount
                ? item.product.discountPrice
                : item.product.price;

              return (
                <article
                  key={item.product._id}
                  className="card bg-base-100 shadow-md"
                >
                  <div className="card-body p-3 md:p-4">
                    <div className="flex flex-col items-start gap-3 md:flex-row md:gap-4">
                      <figure className="aspect-square h-20 w-20 overflow-hidden rounded-lg md:h-24 md:w-24">
                        <img
                          src={item.product.image}
                          alt={item.product.modelNo}
                          className="h-full w-full object-cover"
                        />
                      </figure>

                      <div className="flex w-full flex-1 flex-col">
                        <header className="mb-1 flex items-start justify-between gap-2 md:mb-2">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="line-clamp-2 text-base font-semibold hover:underline md:text-lg"
                          >
                            {item.product.modelNo}
                          </Link>

                          <button
                            className="btn btn-ghost btn-sm btn-square text-error mt-[-4px]"
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={isProcessing}
                            aria-label={`Remove ${item.product.modelNo} from cart`}
                          >
                            {isProcessing ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <Trash size={28} />
                            )}
                          </button>
                        </header>

                        <p className="text-xs text-gray-500 md:text-sm">
                          {item.product.category}
                        </p>

                        {item.product.stock < 5 && (
                          <aside className="mt-1 flex items-center gap-1 text-xs text-amber-600 md:text-sm">
                            <AlertTriangle size={14} />
                            <span>Only {item.product.stock} left in stock</span>
                          </aside>
                        )}

                        <footer className="mt-2 flex items-center justify-between pt-2 md:mt-auto md:pt-4">
                          <div
                            className="flex items-center"
                            role="group"
                            aria-label="Quantity controls"
                          >
                            <button
                              className="btn btn-xs md:btn-sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity,
                                  -1,
                                )
                              }
                              disabled={item.quantity <= 1 || isProcessing}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} className="md:size-4" />
                            </button>
                            <span className="mx-2 min-w-[1.5rem] text-center text-base font-semibold md:min-w-[2rem] md:text-lg">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-xs md:btn-sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity,
                                  1,
                                )
                              }
                              disabled={
                                item.quantity >= item.product.stock ||
                                isProcessing
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} className="md:size-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-bold md:text-lg">
                              ৳{(price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 md:text-sm">
                              ৳{price} each
                            </div>
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="lg:w-1/3">
          <section className="card bg-base-200 sticky hidden shadow-xl md:block">
            <div className="card-body">
              <header className="border-b pb-4">
                <h2 className="card-title">Order Summary</h2>
              </header>

              <div className="py-4">
                <dl className="space-y-2">
                  <div className="flex justify-between pb-2">
                    <dt>Items ({cart.totalItems}):</dt>
                    <dd>৳{cart.totalPrice.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between pb-2">
                    <dt>Shipping:</dt>
                    <dd className="text-success">Free</dd>
                  </div>
                  <div className="flex justify-between pb-2">
                    <dt>Tax:</dt>
                    <dd>৳{(cart.totalPrice * 0.1).toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              <footer className="border-t pt-4">
                <div className="flex justify-between pb-4">
                  <span className="text-lg font-bold">Order Total:</span>
                  <span className="text-lg font-bold">
                    ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>

                {!user ? (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleCheckout}
                  >
                    <LogIn size={18} />
                    Login to Checkout
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                )}

                <Link to="/products" className="btn btn-outline btn-block mt-2">
                  Continue Shopping
                </Link>
              </footer>
            </div>
          </section>

          <section className="card bg-base-200 mb-16 shadow-lg md:hidden">
            <div className="card-body p-4">
              <header
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                aria-expanded={isOrderSummaryOpen}
                aria-controls="mobile-order-summary"
              >
                <h2 className="card-title">Order Summary</h2>
                <button
                  className="btn btn-sm btn-ghost btn-circle"
                  aria-label={
                    isOrderSummaryOpen
                      ? "Collapse order summary"
                      : "Expand order summary"
                  }
                >
                  {isOrderSummaryOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </header>

              <div
                id="mobile-order-summary"
                className={`overflow-hidden transition-all duration-300 ${
                  isOrderSummaryOpen
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-2 border-t py-3">
                  <dl className="space-y-2">
                    <div className="flex justify-between pb-2">
                      <dt>Items ({cart.totalItems}):</dt>
                      <dd>৳{cart.totalPrice.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between pb-2">
                      <dt>Shipping:</dt>
                      <dd className="text-success">Free</dd>
                    </div>
                    <div className="flex justify-between pb-2">
                      <dt>Tax:</dt>
                      <dd>৳{(cart.totalPrice * 0.1).toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>

                <footer className="border-t pt-3">
                  <div className="flex justify-between pb-3">
                    <span className="font-bold">Order Total:</span>
                    <span className="font-bold">
                      ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {!user ? (
                      <button
                        className="btn btn-primary btn-sm w-full"
                        onClick={handleCheckout}
                      >
                        <LogIn size={16} className="mr-1" />
                        Login to Checkout
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm w-full"
                        onClick={handleCheckout}
                      >
                        <ShoppingBag size={16} className="mr-1" />
                        Checkout
                      </button>
                    )}
                    <Link
                      to="/products"
                      className="btn btn-outline btn-sm w-full"
                    >
                      Continue Shopping
                    </Link>
                  </nav>
                </footer>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
