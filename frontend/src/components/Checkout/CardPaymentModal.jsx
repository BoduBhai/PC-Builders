import { useState } from "react";
import { CreditCard, X, AlertCircle, ShieldCheck } from "lucide-react";

const CardPaymentModal = ({
  isOpen,
  onClose,
  cardData,
  handleCardInputChange,
  paymentFormErrors,
  validateCardDetails,
  isProcessing,
  paymentProcessingError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-bold">
            <CreditCard className="mr-2" size={20} />
            Credit/Debit Card Information
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
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
              <span className="label-text font-medium">Cardholder Name</span>
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
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Processing...
                </span>
              ) : (
                "Confirm Details"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default CardPaymentModal;
