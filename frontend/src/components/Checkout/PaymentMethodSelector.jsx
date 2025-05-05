import { CreditCard, Building2, Check, XCircle, Store } from "lucide-react";

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  openCardModal,
  openBankModal,
  isCardPaymentConfirmed,
  isBankTransferConfirmed,
  cardData,
  bankData,
}) => {
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <header className="mb-4 flex items-center">
          <CreditCard className="mr-2" size={20} aria-hidden="true" />
          <h2 className="card-title">Payment Method</h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              paymentMethod === "bank_transfer" ? "btn-primary" : "btn-outline"
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

          <button
            type="button"
            onClick={() => {
              setPaymentMethod("pay_on_pickup");
            }}
            className={`btn h-auto flex-col gap-1 py-4 ${
              paymentMethod === "pay_on_pickup" ? "btn-primary" : "btn-outline"
            }`}
          >
            <div className="flex items-center justify-center">
              <Store className="mr-2" size={20} />
              <span className="font-medium">Pay during pickup</span>
            </div>
            <span className="text-xs opacity-70">
              Pay when you collect your order
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
                      <span className="mr-2 text-lg">Payment Method Valid</span>
                      {(paymentMethod === "card" && isCardPaymentConfirmed) ||
                      (paymentMethod === "bank_transfer" &&
                        isBankTransferConfirmed) ||
                      paymentMethod === "pay_on_pickup" ? (
                        <Check size={24} className="text-success" />
                      ) : (
                        <XCircle size={24} className="text-error" />
                      )}
                    </div>
                  </div>

                  {/* Card details */}
                  {paymentMethod === "card" &&
                    Object.keys(cardData).some((key) => cardData[key]) && (
                      <div className="mt-1 text-sm">
                        <span>
                          Card ending with{" "}
                          {cardData.cardNumber.slice(-4) || "XXXX"}
                        </span>
                      </div>
                    )}

                  {/* Bank details */}
                  {paymentMethod === "bank_transfer" &&
                    Object.keys(bankData).some((key) => bankData[key]) && (
                      <div className="mt-1 text-sm">
                        <span>
                          Bank: {bankData.bankName || "Not specified"}
                        </span>
                      </div>
                    )}

                  {/* Pay during pickup info */}
                  {paymentMethod === "pay_on_pickup" && (
                    <div className="mt-1 text-sm">
                      <span>
                        Payment will be made during pickup at our store
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
  );
};

export default PaymentMethodSelector;
