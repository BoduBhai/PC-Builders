import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import usePaymentService from "../stores/usePaymentService";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Building2,
  ArrowLeft,
  Truck,
  X,
  AlertCircle,
  CheckCheck,
  ShieldCheck,
  Check,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useUserStore();
  const { cart, loading: cartLoading, fetchCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const {
    validatePayment,
    detectSuspiciousActivity: detectServerSuspiciousActivity,
  } = usePaymentService();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "Bangladesh",
  });

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saveAddress, setSaveAddress] = useState(true);

  // Payment confirmation states
  const [isCardPaymentConfirmed, setIsCardPaymentConfirmed] = useState(false);
  const [isBankTransferConfirmed, setIsBankTransferConfirmed] = useState(false);
  const [paymentProcessingError, setPaymentProcessingError] = useState(null);
  const [paymentAttemptCount, setPaymentAttemptCount] = useState(0);

  // Payment modal states
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [bankData, setBankData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
  });
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [bankReferenceNumber, setBankReferenceNumber] = useState("");

  // Security tracking
  const [paymentAttemptTimestamps, setPaymentAttemptTimestamps] = useState([]);
  const [sessionStartTime] = useState(new Date());
  const [clientFingerprint, setClientFingerprint] = useState("");

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
        country: user.address.country || "Bangladesh",
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
      // Fix: Access cart data correctly
      const cartData = useCartStore.getState().cart;
      const subtotal = cartData.totalPrice;
      const tax = subtotal * 0.1; // 10% tax
      const shipping = 0; // Free shipping
      const total = subtotal + tax + shipping;

      // Prepare secure payment details - never sending full card details
      const paymentDetails = {
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        securityFingerprint: clientFingerprint,
      };

      // Add payment method specific details
      if (paymentMethod === "card") {
        paymentDetails.card = {
          last4: cardData.cardNumber.slice(-4),
          brand: detectCardBrand(cardData.cardNumber),
          expiryMonth: cardData.expiryDate.split("/")[0],
          expiryYear: `20${cardData.expiryDate.split("/")[1]}`,
          holderName: cardData.cardholderName,
          transactionId:
            cardData.transactionId ||
            `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        };
      } else if (paymentMethod === "bank_transfer") {
        paymentDetails.bankTransfer = {
          bankName: bankData.bankName,
          accountName: bankData.accountName,
          referenceNumber: bankReferenceNumber,
          transactionId:
            bankData.transactionId ||
            `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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
      };

      // Submit order
      const order = await createOrder(orderData);
      await useCartStore.getState().clearCart();

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

  // Detect card brand based on card number
  const detectCardBrand = (cardNumber) => {
    const cleanedNumber = cardNumber.replace(/\s/g, "");

    // Common card patterns
    if (/^4/.test(cleanedNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanedNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanedNumber)) return "American Express";
    if (/^6(?:011|5)/.test(cleanedNumber)) return "Discover";
    if (/^(?:2131|1800|35\d{3})/.test(cleanedNumber)) return "JCB";

    return "Unknown";
  };

  // The functions to handle payment modals
  const openCardModal = () => setIsCardModalOpen(true);
  const closeCardModal = () => setIsCardModalOpen(false);

  const openBankModal = () => setIsBankModalOpen(true);
  const closeBankModal = () => setIsBankModalOpen(false);

  // Validate payment details but don't actually process payment yet
  const validateCardDetails = async (e) => {
    e.preventDefault();
    setPaymentAttemptCount((prev) => prev + 1);
    setPaymentAttemptTimestamps((prev) => [...prev, new Date()]);

    if (validateCardForm()) {
      setIsProcessing(true);

      try {
        // Check for suspicious activity
        if (
          detectServerSuspiciousActivity(
            paymentAttemptCount,
            paymentAttemptTimestamps,
          )
        ) {
          setPaymentProcessingError(
            "Unusual activity detected. Please contact support.",
          );
          return;
        }

        // Send to backend for validation instead of simulating
        const response = await validatePayment("card", {
          cardNumber: cardData.cardNumber.replace(/\s/g, ""),
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          holderName: cardData.cardholderName,
        });

        if (response.valid) {
          // Card details are valid, close modal and enable place order
          setPaymentProcessingError(null);
          closeCardModal();
          setIsCardPaymentConfirmed(true);

          // Store transaction ID for order submission
          cardData.transactionId = response.transactionId;

          // Log masked card data for security
          const maskedCardData = {
            ...cardData,
            cardNumber: `**** **** **** ${cardData.cardNumber.slice(-4)}`,
            cvv: "***",
          };
          console.log("Card details validated:", maskedCardData);
        } else {
          setPaymentProcessingError(
            response.message || "Card verification failed",
          );
        }
      } catch (error) {
        console.error("Card validation error:", error);
        setPaymentProcessingError(
          "Card verification failed. Please check your details.",
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const validateBankDetails = async (e) => {
    e.preventDefault();
    setPaymentAttemptCount((prev) => prev + 1);
    setPaymentAttemptTimestamps((prev) => [...prev, new Date()]);

    if (validateBankForm()) {
      setIsProcessing(true);

      try {
        // Check for suspicious activity
        if (
          detectServerSuspiciousActivity(
            paymentAttemptCount,
            paymentAttemptTimestamps,
          )
        ) {
          setPaymentProcessingError(
            "Unusual activity detected. Please contact support.",
          );
          return;
        }

        // Send to backend for validation
        const response = await validatePayment("bank_transfer", {
          bankName: bankData.bankName,
          accountName: bankData.accountName,
          accountNumber: bankData.accountNumber,
          branchName: bankData.branchName,
          referenceNumber: bankReferenceNumber,
        });

        if (response.valid) {
          // Bank details are valid, close modal and enable place order
          setPaymentProcessingError(null);
          closeBankModal();
          setIsBankTransferConfirmed(true);

          // Store transaction ID for order submission
          bankData.transactionId = response.transactionId;

          console.log("Bank transfer details validated");
        } else {
          setPaymentProcessingError(
            response.message || "Bank details verification failed",
          );
        }
      } catch (error) {
        console.error("Bank validation error:", error);
        setPaymentProcessingError(
          "Bank details verification failed. Please check your information.",
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    // Apply formatting based on the field type
    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      // Only allow digits for CVV
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardData({
      ...cardData,
      [name]: formattedValue,
    });

    // Clear error when user types
    if (paymentFormErrors[name]) {
      setPaymentFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankData({
      ...bankData,
      [name]: value,
    });

    // Clear error when user types
    if (paymentFormErrors[name]) {
      setPaymentFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateCardForm = () => {
    const errors = {};

    // Card number validation
    if (!cardData.cardNumber.trim()) {
      errors.cardNumber = "Card number is required";
    } else {
      // Strip spaces for validation
      const cleaned = cardData.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleaned)) {
        errors.cardNumber = "Card number must be 16 digits";
      }

      // Check if it's a valid number using Luhn algorithm
      if (!isValidCreditCard(cleaned)) {
        errors.cardNumber = "Invalid card number";
      }
    }

    if (!cardData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    } else if (!/^[A-Za-z\s]+$/.test(cardData.cardholderName)) {
      errors.cardholderName = "Name should contain only letters";
    }

    if (!cardData.expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
      errors.expiryDate = "Format must be MM/YY";
    } else {
      // Check if the card has expired
      const [month, year] = cardData.expiryDate.split("/");
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();

      if (expiryDate < currentDate) {
        errors.expiryDate = "Card has expired";
      }
    }

    if (!cardData.cvv.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }

    setPaymentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Luhn algorithm for credit card validation
  const isValidCreditCard = (number) => {
    // Remove spaces and non-digit characters
    number = number.replace(/\D/g, "");

    if (number.length !== 16) return false;

    let sum = 0;
    let shouldDouble = false;

    // Loop through from right to left
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  // Format card number with spaces as user types
  const formatCardNumber = (value) => {
    if (!value) return value;

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Insert space after every 4 chars
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;

    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const validateBankForm = () => {
    const errors = {};

    if (!bankData.accountName.trim()) {
      errors.accountName = "Account name is required";
    } else if (!/^[A-Za-z\s\.]+$/.test(bankData.accountName)) {
      errors.accountName =
        "Account name should contain only letters, spaces, and periods";
    }

    if (!bankData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (
      !/^\d{10,16}$/.test(bankData.accountNumber.replace(/\s|-/g, ""))
    ) {
      errors.accountNumber = "Account number should be 10-16 digits";
    }

    if (!bankData.bankName.trim()) {
      errors.bankName = "Bank name is required";
    }

    if (!bankData.branchName.trim()) {
      errors.branchName = "Branch name is required";
    }

    setPaymentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format expiry date as user types (MM/YY)
  const formatExpiryDate = (value) => {
    if (!value) return value;

    // Remove non-digit characters
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 2) {
      return cleaned;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
  };

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

      {/* Credit/Debit Card Modal */}
      {isCardModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-bold">
                <CreditCard className="mr-2" size={20} />
                Credit/Debit Card Information
              </h3>
              <button
                onClick={closeCardModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={validateCardDetails} className="space-y-4">
              <div className="bg-primary/10 mb-4 flex items-start rounded-lg p-3">
                <AlertCircle
                  size={20}
                  className="text-primary mt-0.5 mr-2 flex-shrink-0"
                />
                <div className="text-sm">
                  <p className="mb-1 font-medium">
                    For demonstration purposes only
                  </p>
                  <p>
                    In a real application, this would securely process payments
                    through a payment gateway.
                  </p>
                </div>
              </div>

              {paymentProcessingError && (
                <div className="alert alert-error mb-4">
                  <ShieldCheck size={20} className="mr-2" />
                  <span>{paymentProcessingError}</span>
                </div>
              )}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Card Number</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className={`input input-bordered w-full ${paymentFormErrors.cardNumber ? "input-error" : ""}`}
                  value={cardData.cardNumber}
                  onChange={handleCardInputChange}
                  maxLength="19"
                />
                {paymentFormErrors.cardNumber && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {paymentFormErrors.cardNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Cardholder Name
                  </span>
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  className={`input input-bordered w-full ${paymentFormErrors.cardholderName ? "input-error" : ""}`}
                  value={cardData.cardholderName}
                  onChange={handleCardInputChange}
                />
                {paymentFormErrors.cardholderName && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {paymentFormErrors.cardholderName}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Expiry Date</span>
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className={`input input-bordered w-full ${paymentFormErrors.expiryDate ? "input-error" : ""}`}
                    value={cardData.expiryDate}
                    onChange={handleCardInputChange}
                    maxLength="5"
                  />
                  {paymentFormErrors.expiryDate && (
                    <div className="label">
                      <span className="label-text-alt text-error">
                        {paymentFormErrors.expiryDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">CVV</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    className={`input input-bordered w-full ${paymentFormErrors.cvv ? "input-error" : ""}`}
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    maxLength="4"
                  />
                  {paymentFormErrors.cvv && (
                    <div className="label">
                      <span className="label-text-alt text-error">
                        {paymentFormErrors.cvv}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-base-200 mt-2 flex items-center rounded-lg p-3 text-sm">
                <div className="mr-2">🔒</div>
                <p>
                  Your payment information is securely processed. We never store
                  your complete card details.
                </p>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeCardModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Details
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeCardModal}></div>
        </div>
      )}

      {/* Bank Transfer Modal */}
      {isBankModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-bold">
                <Building2 className="mr-2" size={20} />
                Bank Transfer Information
              </h3>
              <button
                onClick={closeBankModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={validateBankDetails} className="space-y-4">
              <div className="bg-base-200 mb-4 rounded-lg p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Transfer to this account:
                </h4>
                <div className="bg-base-300 mb-3 rounded p-3 font-mono text-sm">
                  <div className="mb-1 flex justify-between">
                    <span className="text-base-content/70">Account Name:</span>
                    <span className="font-semibold">PC Builders Ltd</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-base-content/70">
                      Account Number:
                    </span>
                    <span className="font-semibold">0123456789</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-base-content/70">Bank:</span>
                    <span className="font-semibold">Bangladesh Bank</span>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-base-content/70">Branch:</span>
                    <span className="font-semibold">Dhaka Main Branch</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Reference:</span>
                    <span className="font-semibold">
                      {user?.email || "Your Email"}
                    </span>
                  </div>
                </div>
                <p className="text-base-content/70 text-xs">
                  Please complete your bank transfer before submitting this
                  form. The amount to transfer is:{" "}
                  <span className="font-semibold">
                    ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                  </span>
                </p>
              </div>

              {paymentProcessingError && (
                <div className="alert alert-error mb-4">
                  <ShieldCheck size={20} className="mr-2" />
                  <span>{paymentProcessingError}</span>
                </div>
              )}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Your Account Name
                  </span>
                </label>
                <input
                  type="text"
                  name="accountName"
                  placeholder="Your account name as registered with your bank"
                  className={`input input-bordered w-full ${paymentFormErrors.accountName ? "input-error" : ""}`}
                  value={bankData.accountName}
                  onChange={handleBankInputChange}
                />
                {paymentFormErrors.accountName && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {paymentFormErrors.accountName}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Your Account Number
                  </span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Your bank account number"
                  className={`input input-bordered w-full ${paymentFormErrors.accountNumber ? "input-error" : ""}`}
                  value={bankData.accountNumber}
                  onChange={handleBankInputChange}
                />
                {paymentFormErrors.accountNumber && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {paymentFormErrors.accountNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Bank</span>
                  </label>
                  <select
                    name="bankName"
                    className={`select select-bordered w-full ${paymentFormErrors.bankName ? "select-error" : ""}`}
                    value={bankData.bankName}
                    onChange={handleBankInputChange}
                  >
                    <option value="">Select Bank</option>
                    <option value="Sonali Bank">Sonali Bank</option>
                    <option value="Janata Bank">Janata Bank</option>
                    <option value="Agrani Bank">Agrani Bank</option>
                    <option value="Rupali Bank">Rupali Bank</option>
                    <option value="BRAC Bank">BRAC Bank</option>
                    <option value="Dutch-Bangla Bank">Dutch-Bangla Bank</option>
                    <option value="Eastern Bank">Eastern Bank</option>
                    <option value="Islami Bank Bangladesh">
                      Islami Bank Bangladesh
                    </option>
                  </select>
                  {paymentFormErrors.bankName && (
                    <div className="label">
                      <span className="label-text-alt text-error">
                        {paymentFormErrors.bankName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Branch Name</span>
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    placeholder="Your bank's branch"
                    className={`input input-bordered w-full ${paymentFormErrors.branchName ? "input-error" : ""}`}
                    value={bankData.branchName}
                    onChange={handleBankInputChange}
                  />
                  {paymentFormErrors.branchName && (
                    <div className="label">
                      <span className="label-text-alt text-error">
                        {paymentFormErrors.branchName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Reference Number
                  </span>
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  placeholder="Reference number for your bank transfer"
                  className={`input input-bordered w-full ${paymentFormErrors.referenceNumber ? "input-error" : ""}`}
                  value={bankReferenceNumber}
                  onChange={(e) => setBankReferenceNumber(e.target.value)}
                />
                {paymentFormErrors.referenceNumber && (
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {paymentFormErrors.referenceNumber}
                    </span>
                  </div>
                )}
                <p className="mt-1 px-1 text-xs text-gray-500">
                  Enter the reference number provided by your bank after
                  completing the transfer
                </p>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeBankModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Details
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeBankModal}></div>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column - Form */}
        <section className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <header className="mb-4 flex items-center">
                  <Truck className="mr-2" size={20} aria-hidden="true" />
                  <h2 className="card-title">Shipping Address</h2>
                </header>

                <fieldset className="grid gap-4 md:grid-cols-2">
                  <legend className="sr-only">
                    Shipping Address Information
                  </legend>

                  <div className="form-control">
                    <label className="label" htmlFor="street">
                      <span className="label-text">Street Address</span>
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      className={`input input-bordered w-full ${formErrors.street ? "input-error" : ""}`}
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.street}
                      aria-describedby={
                        formErrors.street ? "street-error" : undefined
                      }
                    />
                    {formErrors.street && (
                      <div className="label" id="street-error">
                        <span className="label-text-alt text-error">
                          {formErrors.street}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="city">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className={`input input-bordered w-full ${formErrors.city ? "input-error" : ""}`}
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.city}
                      aria-describedby={
                        formErrors.city ? "city-error" : undefined
                      }
                    />
                    {formErrors.city && (
                      <div className="label" id="city-error">
                        <span className="label-text-alt text-error">
                          {formErrors.city}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="state">
                      <span className="label-text">State</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className={`input input-bordered w-full ${formErrors.state ? "input-error" : ""}`}
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.state}
                      aria-describedby={
                        formErrors.state ? "state-error" : undefined
                      }
                    />
                    {formErrors.state && (
                      <div className="label" id="state-error">
                        <span className="label-text-alt text-error">
                          {formErrors.state}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="zipCode">
                      <span className="label-text">Zip Code</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      className={`input input-bordered w-full ${formErrors.zipCode ? "input-error" : ""}`}
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      aria-required="true"
                      aria-invalid={!!formErrors.zipCode}
                      aria-describedby={
                        formErrors.zipCode ? "zipCode-error" : undefined
                      }
                    />
                    {formErrors.zipCode && (
                      <div className="label" id="zipCode-error">
                        <span className="label-text-alt text-error">
                          {formErrors.zipCode}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label" htmlFor="country">
                      <span className="label-text">Country</span>
                    </label>
                    <select
                      id="country"
                      className="select select-bordered w-full"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                    >
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                  </div>

                  {user && (
                    <div className="form-control md:col-span-2">
                      <label
                        className="label cursor-pointer justify-start gap-2"
                        htmlFor="saveAddress"
                      >
                        <input
                          type="checkbox"
                          id="saveAddress"
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
                </fieldset>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <header className="mb-4 flex items-center">
                  <CreditCard className="mr-2" size={20} aria-hidden="true" />
                  <h2 className="card-title">Payment Method</h2>
                </header>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("card");
                      openCardModal();
                    }}
                    className={`btn h-auto flex-col gap-1 py-4 ${
                      paymentMethod === "card" ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <CreditCard className="mr-2" size={20} />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <span className="text-xs opacity-70">
                      Pay securely with your card
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bank_transfer");
                      openBankModal();
                    }}
                    className={`btn h-auto flex-col gap-1 py-4 ${
                      paymentMethod === "bank_transfer"
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Building2 className="mr-2" size={20} />
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    <span className="text-xs opacity-70">
                      Pay directly from your bank account
                    </span>
                  </button>
                </div>

                <div className="mt-6">
                  {paymentMethod && (
                    <div className="flex flex-col gap-3">
                      <div className="alert bg-accent/20">
                        <div className="w-full">
                          <div className="flex items-center justify-between font-semibold">
                            <div className="flex items-center">
                              <span className="mr-2 text-lg">
                                Payment Method Valid
                              </span>
                              {(paymentMethod === "card" &&
                                isCardPaymentConfirmed) ||
                              (paymentMethod === "bank_transfer" &&
                                isBankTransferConfirmed) ? (
                                <Check size={24} className="text-success" />
                              ) : (
                                <XCircle size={24} className="text-error" />
                              )}
                            </div>
                          </div>

                          {/* Card details */}
                          {paymentMethod === "card" &&
                            Object.keys(cardData).some(
                              (key) => cardData[key],
                            ) && (
                              <div className="mt-1 text-sm">
                                <span>
                                  Card ending with{" "}
                                  {cardData.cardNumber.slice(-4) || "XXXX"}
                                </span>
                              </div>
                            )}

                          {/* Bank details */}
                          {paymentMethod === "bank_transfer" &&
                            Object.keys(bankData).some(
                              (key) => bankData[key],
                            ) && (
                              <div className="mt-1 text-sm">
                                <span>
                                  Bank: {bankData.bankName || "Not specified"}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Right column - Order Summary */}
        <aside className="lg:w-1/3">
          <div className="card bg-base-200 sticky top-20 shadow-md">
            <div className="card-body">
              <h2 className="card-title border-b pb-4">Order Summary</h2>

              <dl className="py-4">
                <div className="flex justify-between pb-2">
                  <dt>Items ({cart.totalItems}):</dt>
                  <dd>৳{cart.totalPrice.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt>Shipping:</dt>
                  <dd className="text-success">Free</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt>Tax (10%):</dt>
                  <dd>৳{(cart.totalPrice * 0.1).toFixed(2)}</dd>
                </div>
              </dl>

              <div className="border-t pt-4">
                <div className="flex justify-between pb-4">
                  <dt className="text-lg font-bold">Order Total:</dt>
                  <dd className="text-lg font-bold">
                    ৳{(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}
                  </dd>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={handleSubmit}
                  disabled={
                    isProcessing ||
                    orderLoading ||
                    !paymentMethod ||
                    (paymentMethod === "card" && !isCardPaymentConfirmed) ||
                    (paymentMethod === "bank_transfer" &&
                      !isBankTransferConfirmed)
                  }
                  aria-busy={isProcessing || orderLoading}
                >
                  {isProcessing || orderLoading ? (
                    <span className="flex items-center">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Processing...
                    </span>
                  ) : !paymentMethod ? (
                    "Select a payment method"
                  ) : paymentMethod === "card" && !isCardPaymentConfirmed ? (
                    "Confirm card payment first"
                  ) : paymentMethod === "bank_transfer" &&
                    !isBankTransferConfirmed ? (
                    "Confirm bank transfer first"
                  ) : (
                    `Place Order ৳${(cart.totalPrice + cart.totalPrice * 0.1).toFixed(2)}`
                  )}
                </button>
              </div>

              <section className="mt-6">
                <h3 className="mb-2 text-lg font-medium">Order Items</h3>
                <ul
                  className="max-h-64 overflow-y-auto"
                  aria-label="Order items"
                >
                  {cart.items.map((item) => (
                    <li
                      key={item.product._id}
                      className="border-primary/80 mb-3 flex items-center gap-3 border-b pb-3 last:mb-0 last:border-b-0"
                    >
                      <figure className="h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={item.product.image}
                          alt={item.product.modelNo}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </figure>
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
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
