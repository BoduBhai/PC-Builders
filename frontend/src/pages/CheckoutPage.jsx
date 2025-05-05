import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useForm from "../hooks/useForm";
import usePaymentValidation from "../hooks/usePaymentValidation";

// Components
import LoadingSpinner from "../components/LoadingSpinner";
import ShippingAddressForm from "../components/Checkout/ShippingAddressForm";
import PaymentMethodSelector from "../components/Checkout/PaymentMethodSelector";
import OrderSummary from "../components/Checkout/OrderSummary";
import CardPaymentModal from "../components/Checkout/CardPaymentModal";
import BankTransferModal from "../components/Checkout/BankTransferModal";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useUserStore();
  const { cart, loading: cartLoading, fetchCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();

  // Form states
  const [saveAddress, setSaveAddress] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientFingerprint, setClientFingerprint] = useState("");
  const [sessionStartTime] = useState(new Date());

  // Use payment validation hook
  const paymentValidation = usePaymentValidation();

  // Initialize form with user's address data
  const initialShippingAddress = {
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "Bangladesh",
  };

  // Form validation
  const validateShippingForm = (values) => {
    const errors = {};

    if (!values.street.trim()) {
      errors.street = "Street address is required";
    }

    if (!values.city.trim()) {
      errors.city = "City is required";
    }

    if (!values.state.trim()) {
      errors.state = "State is required";
    }

    if (!values.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }

    return errors;
  };

  // Use form hook
  const {
    values: shippingAddress,
    errors: formErrors,
    handleChange: handleInputChange,
    setValues: setShippingAddress,
  } = useForm(initialShippingAddress, () => {}, validateShippingForm);

  // Generate a simple client fingerprint for demo purposes
  useEffect(() => {
    const generateFingerprint = () => {
      const browser = navigator.userAgent;
      const screenRes = `${window.screen.width}x${window.screen.height}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hash = btoa(
        `${browser}-${screenRes}-${timeZone}-${sessionStartTime.toISOString()}`,
      );
      return hash.substring(0, 16);
    };

    setClientFingerprint(generateFingerprint());
  }, [sessionStartTime]);

  // Fetch cart data on component mount
  useEffect(() => {
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
        country: user.address.country || "Bangladesh",
      });
    }
  }, [user, setShippingAddress]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      navigate("/cart");
    }
  }, [cart, cartLoading, navigate]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate shipping form
    const validationErrors = validateShippingForm(shippingAddress);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const cartData = useCartStore.getState().cart;
      const subtotal = cartData.totalPrice;
      const tax = subtotal * 0.1; // 10% tax
      const shipping = 0; // Free shipping
      const total = subtotal + tax + shipping;

      // Get the selected payment method details
      const paymentMethod = paymentValidation.paymentMethod;

      // Prepare secure payment details - never sending full card details
      const paymentDetails = {
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        securityFingerprint: clientFingerprint,
      };

      // Add payment method specific details
      if (paymentMethod === "card") {
        paymentDetails.card = {
          last4: paymentValidation.cardData.cardNumber.slice(-4),
          brand: paymentValidation.detectCardBrand(
            paymentValidation.cardData.cardNumber,
          ),
          expiryMonth: paymentValidation.cardData.expiryDate.split("/")[0],
          expiryYear: `20${paymentValidation.cardData.expiryDate.split("/")[1]}`,
          holderName: paymentValidation.cardData.cardholderName,
          transactionId:
            paymentValidation.cardData.transactionId ||
            `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        };
      } else if (paymentMethod === "bank_transfer") {
        paymentDetails.bankTransfer = {
          bankName: paymentValidation.bankData.bankName,
          accountName: paymentValidation.bankData.accountName,
          referenceNumber: paymentValidation.bankReferenceNumber,
          transactionId:
            paymentValidation.bankData.transactionId ||
            `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        };
      } else if (paymentMethod === "pay_on_pickup") {
        paymentDetails.pickupPayment = {
          transactionId: `PICKUP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          instructions: "Payment will be collected during pickup at our store",
        };
      }

      // Create order object
      const orderData = {
        shippingAddress,
        paymentMethod,
        paymentDetails,
        subtotal,
        tax,
        shipping,
        total,
        // Set payment status based on payment method
        paymentStatus:
          paymentMethod === "pay_on_pickup" ? "pending" : "completed",
      };

      // Submit order
      const order = await createOrder(orderData);

      // Save address to user profile if checkbox is checked
      if (saveAddress && user) {
        await updateUserProfile({ address: shippingAddress });
      }

      // Clear cart after order is created
      await useCartStore.getState().clearCart();

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);

      // Show appropriate error to user
      toast.error(
        error.response?.data?.message ||
          "Failed to process your order. Please try again.",
      );
    }
  };

  // Show loading spinner while cart data is loading
  if (cartLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <main className="container mx-auto">
      <Link
        to="/cart"
        className="hover:text-primary flex items-center text-sm font-medium transition-colors"
        aria-label="Return to cart"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Cart
      </Link>

      <header className="my-6 text-center">
        <h1 className="text-success text-4xl font-bold">Checkout</h1>
      </header>

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={paymentValidation.isCardModalOpen}
        onClose={paymentValidation.closeCardModal}
        cardData={paymentValidation.cardData}
        handleCardInputChange={paymentValidation.handleCardInputChange}
        paymentFormErrors={paymentValidation.paymentFormErrors}
        validateCardDetails={paymentValidation.validateCardDetails}
        isProcessing={paymentValidation.isProcessing}
        paymentProcessingError={paymentValidation.paymentProcessingError}
      />

      {/* Bank Transfer Modal */}
      <BankTransferModal
        isOpen={paymentValidation.isBankModalOpen}
        onClose={paymentValidation.closeBankModal}
        bankData={paymentValidation.bankData}
        handleBankInputChange={paymentValidation.handleBankInputChange}
        paymentFormErrors={paymentValidation.paymentFormErrors}
        validateBankDetails={paymentValidation.validateBankDetails}
        isProcessing={paymentValidation.isProcessing}
        paymentProcessingError={paymentValidation.paymentProcessingError}
        bankReferenceNumber={paymentValidation.bankReferenceNumber}
        setBankReferenceNumber={paymentValidation.setBankReferenceNumber}
        user={user}
        cart={cart}
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column - Form */}
        <section className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address Form */}
            <ShippingAddressForm
              shippingAddress={shippingAddress}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
              user={user}
            />

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              paymentMethod={paymentValidation.paymentMethod}
              setPaymentMethod={paymentValidation.setPaymentMethod}
              openCardModal={paymentValidation.openCardModal}
              openBankModal={paymentValidation.openBankModal}
              isCardPaymentConfirmed={paymentValidation.isCardPaymentConfirmed}
              isBankTransferConfirmed={
                paymentValidation.isBankTransferConfirmed
              }
              cardData={paymentValidation.cardData}
              bankData={paymentValidation.bankData}
            />
          </form>
        </section>

        {/* Right column - Order Summary */}
        <aside className="lg:w-1/3">
          <OrderSummary
            cart={cart}
            isProcessing={isProcessing || paymentValidation.isProcessing}
            orderLoading={orderLoading}
            paymentMethod={paymentValidation.paymentMethod}
            isCardPaymentConfirmed={paymentValidation.isCardPaymentConfirmed}
            isBankTransferConfirmed={paymentValidation.isBankTransferConfirmed}
            handleSubmit={handleSubmit}
          />
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
