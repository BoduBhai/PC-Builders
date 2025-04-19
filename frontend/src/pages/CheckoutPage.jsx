import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { CreditCard, Building2, ArrowLeft, Truck } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useUserStore();
  const { cart, loading: cartLoading, fetchCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formErrors, setFormErrors] = useState({});
  const [saveAddress, setSaveAddress] = useState(true);

  useEffect(() => {
    // Fetch the latest cart data
    fetchCart();
  }, [fetchCart]);

  // Update shipping address when user data changes
  useEffect(() => {
    if (user && user.address) {
      setShippingAddress({
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        zipCode: user.address.zipCode || "",
        country: user.address.country || "United States",
      });
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      navigate("/cart");
    }
  }, [cart, cartLoading, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!shippingAddress.street.trim()) {
      errors.street = "Street address is required";
    }

    if (!shippingAddress.city.trim()) {
      errors.city = "City is required";
    }

    if (!shippingAddress.state.trim()) {
      errors.state = "State is required";
    }

    if (!shippingAddress.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Save address to user profile if checkbox is checked
      if (saveAddress && user) {
        await updateUserProfile({
          address: shippingAddress,
        });
      }

      // Calculate order totals
      const subtotal = cart.totalPrice;
      const tax = subtotal * 0.1; // 10% tax
      const shipping = 0; // Free shipping
      const total = subtotal + tax + shipping;

      // Create order object
      const orderData = {
        shippingAddress,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
      };

      // Submit order
      const order = await createOrder(orderData);
      await useCartStore.getState().clearCart();

      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container mx-auto my-10 p-4 pt-16">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/cart")}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>
        <h1 className="ml-4 text-2xl font-bold md:text-3xl">Checkout</h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column - Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="mb-4 flex items-center">
                  <Truck className="mr-2" size={20} />
                  <h2 className="card-title">Shipping Address</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Street Address</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      className={`input input-bordered w-full ${formErrors.street ? "input-error" : ""}`}
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                    />
                    {formErrors.street && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {formErrors.street}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className={`input input-bordered w-full ${formErrors.city ? "input-error" : ""}`}
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                    />
                    {formErrors.city && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {formErrors.city}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">State</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      className={`input input-bordered w-full ${formErrors.state ? "input-error" : ""}`}
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                    />
                    {formErrors.state && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {formErrors.state}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Zip Code</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      className={`input input-bordered w-full ${formErrors.zipCode ? "input-error" : ""}`}
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                    />
                    {formErrors.zipCode && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {formErrors.zipCode}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Country</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                    >
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  {user && (
                    <div className="form-control md:col-span-2">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          className="checkbox border-red-600 checked:bg-red-600 checked:text-white"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                        />
                        <span className="label-text">
                          Save this address to my profile
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="mb-4 flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  <h2 className="card-title">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="hover:border-primary flex cursor-pointer flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="radio radio-primary mr-2"
                      />
                      <div className="flex items-center">
                        <CreditCard className="mr-2" size={20} />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Pay securely with your card
                    </span>
                  </label>

                  <label className="hover:border-primary flex cursor-pointer flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                        className="radio radio-primary mr-2"
                      />
                      <div className="flex items-center">
                        <Building2 className="mr-2" size={20} />
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Pay directly from your bank account
                    </span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="bg-base-200 mt-6 rounded-lg p-4">
                    <p className="text-sm">
                      For demonstration purposes, no actual card information is
                      required. In a real application, this would integrate with
                      a payment processor like Stripe.
                    </p>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="bg-base-200 mt-6 rounded-lg p-4">
                    <p className="mb-2 font-semibold">Bank Transfer Details:</p>
                    <p className="text-sm">
                      Account Name: PC Builders Ltd.
                      <br />
                      Account Number: XXXX-XXXX-XXXX-1234
                      <br />
                      Bank: Bangladesh Bank
                      <br />
                      Reference: Include your email address as reference
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="card bg-base-100 sticky top-20 shadow-md">
            <div className="card-body">
              <h2 className="card-title border-b pb-4">Order Summary</h2>

              <div className="py-4">
                <div className="flex justify-between pb-2">
                  <span>Items ({cart.totalItems}):</span>
                  <span>৳{cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span>Tax (10%):</span>
                  <span>৳{(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between pb-4">
                  <span className="text-lg font-bold">Order Total:</span>
                  <span className="text-lg font-bold">
                    ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={handleSubmit}
                  disabled={isProcessing || orderLoading}
                >
                  {isProcessing || orderLoading ? (
                    <span className="flex items-center">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Processing...
                    </span>
                  ) : (
                    `Place Order ৳${(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}`
                  )}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 font-medium">Order Items</h3>
                <div className="max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="mb-3 flex items-center gap-3"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={item.product.image}
                          alt={item.product.modelNo}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium">
                          {item.product.modelNo}
                        </p>
                        <div className="text-xs text-gray-500">
                          ৳
                          {(item.product.onDiscount
                            ? item.product.discountPrice
                            : item.product.price
                          ).toFixed(2)}{" "}
                          x {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
