import React from "react";

const CustomBudgetForm = ({
  customBudget,
  setCustomBudget,
  generateCustomConfiguration,
  isGeneratingCustomBuild,
}) => {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg">Enter Your Budget</h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Budget Amount (৳)</span>
          </label>
          <div className="join w-full">
            <span className="btn btn-neutral join-item no-animation">৳</span>
            <input
              type="number"
              min="400"
              step="50"
              value={customBudget}
              onChange={(e) =>
                setCustomBudget(Math.max(400, parseInt(e.target.value) || 0))
              }
              className="input input-bordered join-item w-full"
              placeholder="Enter amount in taka"
            />
            <button
              className="btn btn-primary join-item"
              onClick={generateCustomConfiguration}
              disabled={isGeneratingCustomBuild}
            >
              {isGeneratingCustomBuild ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Build My PC"
              )}
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt">Minimum budget ৳400</span>
            <span className="label-text-alt">Recommended: ৳600-৳3500</span>
          </label>
        </div>
        <p className="text-sm">
          We'll build you the best possible PC for your exact budget
        </p>
      </div>
    </div>
  );
};

export default CustomBudgetForm;
