import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown, ChevronUp, Layers } from "lucide-react";
import ResponsiveImage from "../../components/ui/ResponsiveImage";
import { getComponentImage, getComponentName } from "../BuildPC/componentUtils";
import ComponentList from "./ComponentList";

const PCConfigurationCard = ({
  pcType,
  budgetRange,
  configuration,
  budgetRangeName,
  description,
  isCustom = false,
  targetBudget,
  onAddToCart,
  addingToCartId,
  componentDisplayNames,
}) => {
  const [expanded, setExpanded] = useState(isCustom);
  const { components, totalPrice } = configuration;

  const handleAddToCart = () => {
    onAddToCart(pcType, budgetRange);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get key components to highlight
  const keyComponents = Object.entries(components).filter(([componentType]) =>
    ["processor", "graphicsCard", "ram1", "motherboard"].includes(
      componentType,
    ),
  );

  return (
    <div
      className={`card overflow-hidden ${
        isCustom
          ? "from-base-100 to-base-200 border-primary border-2 bg-gradient-to-br"
          : "bg-base-100"
      } shadow-xl transition-all hover:shadow-2xl`}
    >
      <div className="card-body p-0">
        {/* Card Header with pricing and title */}
        <div className="bg-base-200/50 p-6">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              {isCustom && (
                <div className="badge badge-primary mb-2 px-4 py-3 font-medium">
                  Custom Build
                </div>
              )}
              <h2 className="card-title text-xl font-bold md:text-2xl">
                {budgetRangeName}
              </h2>
              <p className="text-base-content/80 mt-1 max-w-md">
                {isCustom
                  ? `Optimized for your ৳${targetBudget.toLocaleString()} budget`
                  : description}
              </p>
            </div>

            <div className="mt-4 text-right md:mt-0">
              <div className="text-primary text-3xl font-bold">
                ৳{totalPrice.toLocaleString()}
              </div>

              {isCustom && (
                <div className="mt-1 text-xs">
                  {totalPrice < targetBudget ? (
                    <span className="text-success">
                      ৳{(targetBudget - totalPrice).toLocaleString()} under
                      budget
                    </span>
                  ) : (
                    <span className="text-error">
                      ৳{(totalPrice - targetBudget).toLocaleString()} over
                      budget
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Components Section */}
        <div className="p-6">
          {/* PC Type and Component Count */}
          <div className="mb-6">
            <div className="stats w-full shadow">
              <div className="stat p-2">
                <div className="stat-title text-xs">Components</div>
                <div className="stat-value text-lg">
                  {Object.keys(components).length}
                </div>
              </div>
              <div className="stat p-2">
                <div className="stat-title text-xs">PC Type</div>
                <div className="stat-value text-lg capitalize">{pcType}</div>
              </div>
            </div>
          </div>

          {/* Key Components Summary */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <Layers size={18} />
              Key Components
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {keyComponents.map(([componentType, product]) => (
                <div
                  key={componentType}
                  className="bg-base-200/50 hover:bg-base-200 flex items-center gap-3 rounded-lg p-3 transition-colors"
                >
                  <div className="bg-base-100 flex h-10 w-10 items-center justify-center rounded-md p-1">
                    <ResponsiveImage
                      src={getComponentImage(componentType)}
                      alt={componentType}
                      className="h-8 w-8"
                      objectFit="contain"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium">
                      {getComponentName(componentType)}
                    </div>
                    <div className="text-base-content/70 max-w-[180px] truncate text-xs">
                      {product.modelNo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expand/collapse component details */}
          <button
            className="btn btn-ghost btn-sm text-base-content/70 hover:bg-base-200 mt-6 w-full"
            onClick={toggleExpanded}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} /> Hide Full Specification
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Show Full Specification
              </>
            )}
          </button>

          {/* Full component details */}
          {expanded && (
            <div className="border-base-content/10 mt-2 border-t pt-4">
              <ComponentList
                components={components}
                totalPrice={totalPrice}
                componentDisplayNames={componentDisplayNames}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="border-base-content/10 bg-base-200/30 border-t p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/build-pc"
              className="btn btn-outline"
              state={{
                fromPreBuilt: true,
                components: components,
              }}
            >
              Customize This Build
            </Link>
            <button
              className="btn btn-primary"
              disabled={
                addingToCartId ===
                (isCustom ? "custom" : `${pcType}-${budgetRange}`)
              }
              onClick={handleAddToCart}
            >
              {addingToCartId ===
              (isCustom ? "custom" : `${pcType}-${budgetRange}`) ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCConfigurationCard;
