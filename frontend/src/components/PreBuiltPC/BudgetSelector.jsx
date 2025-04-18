import React from "react";
import { DollarSign, Coins, Sparkles, Zap } from "lucide-react";

const BudgetSelector = ({
  isCustomBudget,
  setIsCustomBudget,
  selectedBudgetRange,
  setSelectedBudgetRange,
  budgetRanges,
  selectedType,
}) => {
  // Budget range cards with visual representation
  const budgetRangeCards = [
    {
      id: "budget",
      name: "Budget",
      icon: <Coins className="text-amber-500" size={24} />,
      description: "Affordable and functional",
    },
    {
      id: "midRange",
      name: "Mid-Range",
      icon: <Sparkles className="text-blue-500" size={24} />,
      description: "Balanced performance and value",
    },
    {
      id: "highEnd",
      name: "High-End",
      icon: <Zap className="text-purple-500" size={24} />,
      description: "Premium performance",
    },
  ];

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };

  return (
    <div className="mb-10">
      <h2 className="mb-6 text-2xl font-bold">Select Your Budget Range</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <button
          className={`btn relative px-6 ${
            !isCustomBudget ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setIsCustomBudget(false)}
        >
          <div className="flex items-center justify-center gap-2">
            <Coins size={18} />
            <span>Preset Budgets</span>
          </div>
        </button>

        <button
          className={`btn relative px-6 ${
            isCustomBudget ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setIsCustomBudget(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <DollarSign size={18} />
            <span>Custom Budget</span>
          </div>
        </button>
      </div>

      {!isCustomBudget && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {budgetRangeCards.map((range) => {
            const budgetInfo = budgetRanges[selectedType][range.id];
            const isSelected = selectedBudgetRange === range.id;

            return (
              <div
                key={range.id}
                className={`card cursor-pointer transition-all ${
                  isSelected
                    ? "from-primary/20 to-base-100 border-primary border-2 bg-gradient-to-br shadow-lg"
                    : "bg-base-100 shadow hover:shadow-md"
                }`}
                onClick={() => setSelectedBudgetRange(range.id)}
              >
                <div className="card-body p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${isSelected ? "bg-primary/20" : "bg-base-200"}`}
                    >
                      {range.icon}
                    </div>
                    <h3 className="text-lg font-bold">{range.name}</h3>
                  </div>

                  <p className="text-base-content/70 mb-2 text-sm">
                    {range.description}
                  </p>

                  <div className="mt-auto">
                    <div className="text-base-content/60 text-xs">
                      Price Range:
                    </div>
                    <div className="font-medium">
                      {formatPrice(budgetInfo.minPrice)} -{" "}
                      {formatPrice(budgetInfo.maxPrice)}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="badge badge-primary">Selected</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetSelector;
