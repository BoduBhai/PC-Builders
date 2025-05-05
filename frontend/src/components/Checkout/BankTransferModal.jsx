import { Building2, X, ShieldCheck } from "lucide-react";

const BankTransferModal = ({
  isOpen,
  onClose,
  bankData,
  handleBankInputChange,
  paymentFormErrors,
  validateBankDetails,
  isProcessing,
  paymentProcessingError,
  bankReferenceNumber,
  setBankReferenceNumber,
  user,
  cart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-bold">
            <Building2 className="mr-2" size={20} />
            Bank Transfer Information
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
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
                <span className="text-base-content/70">Account Number:</span>
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
              Please complete your bank transfer before submitting this form.
              The amount to transfer is:{" "}
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
              <span className="label-text font-medium">Your Account Name</span>
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
              <span className="label-text font-medium">Reference Number</span>
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
              Enter the reference number provided by your bank after completing
              the transfer
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

export default BankTransferModal;
