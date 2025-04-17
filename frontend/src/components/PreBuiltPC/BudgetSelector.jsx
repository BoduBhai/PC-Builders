import React from "react";
import { Sliders, DollarSign } from "lucide-react";

const BudgetSelector = ({
  isCustomBudget,
  setIsCustomBudget,
  selectedBudgetRange,
  setSelectedBudgetRange,
  budgetRanges,
  selectedType,
}) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">Select Your Budget</h2>

      <div className="flex flex-col gap-4">
        {/* Toggle between predefined ranges and custom budget */}
        <div className="flex flex-wrap gap-4">
          <button
            className={`btn ${!isCustomBudget ? "btn-primary" : "btn-outline"}`}
            onClick={() => setIsCustomBudget(false)}
          >
            <Sliders size={16} className="mr-2" />
            Predefined Ranges
          </button>

          <button
            className={`btn ${isCustomBudget ? "btn-primary" : "btn-outline"}`}
            onClick={() => setIsCustomBudget(true)}
          >
            <DollarSign size={16} className="mr-2" />
            Custom Budget
          </button>
        </div>

        {!isCustomBudget && (
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className={`btn ${selectedBudgetRange === "budget" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedBudgetRange("budget")}
            >
              Budget
              <span className="badge badge-sm ml-1">
                ৳{budgetRanges[selectedType].budget.minPrice}-৳
                {budgetRanges[selectedType].budget.maxPrice}
              </span>
            </button>

            <button
              className={`btn ${selectedBudgetRange === "midRange" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedBudgetRange("midRange")}
            >
              Mid-Range
              <span className="badge badge-sm ml-1">
                ৳{budgetRanges[selectedType].midRange.minPrice}-৳
                {budgetRanges[selectedType].midRange.maxPrice}
              </span>
            </button>

            <button
              className={`btn ${selectedBudgetRange === "highEnd" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedBudgetRange("highEnd")}
            >
              High-End
              <span className="badge badge-sm ml-1">
                ৳{budgetRanges[selectedType].highEnd.minPrice}-৳
                {budgetRanges[selectedType].highEnd.maxPrice}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSelector;
