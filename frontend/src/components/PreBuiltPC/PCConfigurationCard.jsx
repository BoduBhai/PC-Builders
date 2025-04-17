import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
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

  return (
    <div
      className={`card bg-base-100 ${isCustom ? "border-primary border-2" : ""} overflow-hidden shadow-xl`}
    >
      <div className="card-body">
        <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            {isCustom && (
              <div className="badge badge-primary mb-2">Custom Build</div>
            )}
            <h2 className="card-title text-xl md:text-2xl">
              {budgetRangeName}
            </h2>
            <p className="text-base-content/70">
              {isCustom
                ? `Optimized for your ৳${targetBudget} budget`
                : description}
            </p>
          </div>
          <div className="mt-2 text-2xl font-bold md:mt-0">
            <div className="text-right">
              <span className="text-sm font-normal opacity-70">Total:</span> ৳
              {totalPrice.toFixed(2)}
            </div>
            {isCustom && (
              <div className="text-right text-xs">
                {totalPrice < targetBudget ? (
                  <span className="text-success">
                    ৳{(targetBudget - totalPrice).toFixed(2)} under budget
                  </span>
                ) : (
                  <span className="text-error">
                    ৳{(totalPrice - targetBudget).toFixed(2)} over budget
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key components summary */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(components)
            .filter(([componentType]) =>
              ["processor", "motherboard", "graphicsCard"].includes(
                componentType,
              ),
            )
            .map(([componentType, product]) => (
              <div
                key={componentType}
                className="bg-base-200 flex items-center gap-3 rounded-lg p-3"
              >
                <div className="w-10">
                  <ResponsiveImage
                    src={getComponentImage(componentType)}
                    alt={componentType}
                    className="h-10 w-10"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {getComponentName(componentType)}
                  </div>
                  <div className="max-w-[200px] truncate text-xs">
                    {product.modelNo}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Expand/collapse component details */}
        {!isCustom && (
          <button
            className="btn btn-ghost btn-sm w-full"
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
        )}

        {/* Full component details */}
        {expanded && (
          <ComponentList
            components={components}
            totalPrice={totalPrice}
            componentDisplayNames={componentDisplayNames}
          />
        )}

        <div className="card-actions mt-6 justify-end">
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
  );
};

export default PCConfigurationCard;
