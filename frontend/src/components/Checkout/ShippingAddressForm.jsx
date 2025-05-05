import { Truck } from "lucide-react";

const ShippingAddressForm = ({
  shippingAddress,
  handleInputChange,
  formErrors,
  saveAddress,
  setSaveAddress,
  user,
}) => {
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <header className="mb-4 flex items-center">
          <Truck className="mr-2" size={20} aria-hidden="true" />
          <h2 className="card-title">Shipping Address</h2>
        </header>

        <fieldset className="grid gap-4 md:grid-cols-2">
          <legend className="sr-only">Shipping Address Information</legend>

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
              aria-describedby={formErrors.street ? "street-error" : undefined}
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
              aria-describedby={formErrors.city ? "city-error" : undefined}
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
              aria-describedby={formErrors.state ? "state-error" : undefined}
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
  );
};

export default ShippingAddressForm;
