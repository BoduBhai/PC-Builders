import React from "react";
import { Settings, Cpu } from "lucide-react";

const CustomBudgetForm = ({
  customBudget,
  setCustomBudget,
  generateCustomConfiguration,
  isGeneratingCustomBuild,
  selectedType,
}) => {
  const pcTypeLabels = {
    gaming: "Gaming PC",
    productivity: "Workstation PC",
    regular: "Home/Office PC",
  };

  // Min and max budget values
  const MIN_BUDGET = 25000;
  const MAX_BUDGET = 120000;

  return (
    <div className="card from-base-100 to-base-200 border-base-300 border bg-gradient-to-br shadow-lg">
      <div className="card-body">
        <div className="mb-2 flex items-center gap-3">
          <div className="bg-primary/20 rounded-full p-2">
            <Settings size={24} className="text-primary" />
          </div>
          <h3 className="card-title text-xl">
            Build Your Custom {pcTypeLabels[selectedType]}
          </h3>
        </div>

        <p className="text-base-content/70 mb-6">
          We'll optimize your PC configuration to get the best performance
          possible for your exact budget
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center font-medium">
              <Cpu size={16} className="mr-2" />
              Enter Your Budget Amount
            </span>
            <span className="label-text-alt">
              Range starts from ৳{MIN_BUDGET.toLocaleString()}
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-grow">
              <div className="join w-full">
                <span className="btn btn-neutral join-item no-animation">
                  ৳
                </span>
                <input
                  type="number"
                  min={MIN_BUDGET}
                  step="50"
                  value={customBudget}
                  onChange={(e) =>
                    setCustomBudget(
                      Math.max(MIN_BUDGET, parseInt(e.target.value) || 0),
                    )
                  }
                  className="join-item input input-bordered w-full"
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
                    <span className="font-bold">৳</span>
                  )}
                  {isGeneratingCustomBuild ? "Building..." : "Build My PC"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="alert bg-base-300/50 text-sm shadow-sm">
              <div>
                <span className="font-semibold">Recommended Budgets:</span>
                <ul className="mt-1 space-y-1">
                  <li className="flex justify-between">
                    <span>Budget Gaming PC:</span>
                    <span>৳30,000 - ৳50,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mid-Range Gaming PC:</span>
                    <span>৳50,000 - ৳70,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>High-End Gaming PC:</span>
                    <span>৳70,000 - ৳120,000</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-base-300 h-2.5 w-full rounded-full">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{
                  width: `${Math.min(100, (customBudget / MAX_BUDGET) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span>৳{MIN_BUDGET.toLocaleString()}</span>
              <span>৳{MAX_BUDGET.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBudgetForm;
