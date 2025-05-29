import { useState } from "react";
import usePaymentService from "../stores/usePaymentService";

const usePaymentValidation = () => {
  const { validatePayment, detectSuspiciousActivity } = usePaymentService();

  // Card data state
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Bank transfer data state
  const [bankData, setBankData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
  });

  const [bankReferenceNumber, setBankReferenceNumber] = useState("");
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProcessingError, setPaymentProcessingError] = useState(null);
  const [isCardPaymentConfirmed, setIsCardPaymentConfirmed] = useState(false);
  const [isBankTransferConfirmed, setIsBankTransferConfirmed] = useState(false);
  const [paymentAttemptCount, setPaymentAttemptCount] = useState(0);
  const [paymentAttemptTimestamps, setPaymentAttemptTimestamps] = useState([]);

  // Payment method handling
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Helpers for card input formatting
  const formatCardNumber = (value) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
  };

  // Card input change handler
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user types
    if (paymentFormErrors[name]) {
      setPaymentFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Bank transfer input change handler
  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (paymentFormErrors[name]) {
      setPaymentFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validation functions
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

  const validateBankForm = () => {
    const errors = {};

    if (!bankData.accountName.trim()) {
      errors.accountName = "Account name is required";
      // eslint-disable-next-line no-useless-escape
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

  // Credit card validator using Luhn algorithm
  const isValidCreditCard = (number) => {
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

  // Card brand detection
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

  // Modal control functions
  const openCardModal = () => setIsCardModalOpen(true);
  const closeCardModal = () => setIsCardModalOpen(false);
  const openBankModal = () => setIsBankModalOpen(true);
  const closeBankModal = () => setIsBankModalOpen(false);

  // Set payment method to pay_on_pickup directly since it doesn't need validation
  const setPaymentMethodWithValidation = (method) => {
    setPaymentMethod(method);
  };

  // Card validation handler
  const validateCardDetails = async (e) => {
    e.preventDefault();
    setPaymentAttemptCount((prev) => prev + 1);
    setPaymentAttemptTimestamps((prev) => [...prev, new Date()]);

    if (validateCardForm()) {
      setIsProcessing(true);

      try {
        // Check for suspicious activity
        if (
          detectSuspiciousActivity(
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
          setCardData((prev) => ({
            ...prev,
            transactionId: response.transactionId,
          }));
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

  // Bank transfer validation handler
  const validateBankDetails = async (e) => {
    e.preventDefault();
    setPaymentAttemptCount((prev) => prev + 1);
    setPaymentAttemptTimestamps((prev) => [...prev, new Date()]);

    if (validateBankForm()) {
      setIsProcessing(true);

      try {
        // Check for suspicious activity
        if (
          detectSuspiciousActivity(
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
          setBankData((prev) => ({
            ...prev,
            transactionId: response.transactionId,
          }));

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

  return {
    cardData,
    bankData,
    bankReferenceNumber,
    setBankReferenceNumber,
    paymentMethod,
    setPaymentMethod,
    isCardPaymentConfirmed,
    isBankTransferConfirmed,
    paymentFormErrors,
    isProcessing,
    paymentProcessingError,
    isCardModalOpen,
    isBankModalOpen,
    handleCardInputChange,
    handleBankInputChange,
    validateCardDetails,
    validateBankDetails,
    openCardModal,
    closeCardModal,
    openBankModal,
    closeBankModal,
    detectCardBrand,
    setPaymentMethodWithValidation,
  };
};

export default usePaymentValidation;
