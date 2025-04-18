// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\OrderItemsList.jsx
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * Component to display order items with expandable details
 */
const OrderItemsList = ({ items, expandedItems, toggleItemExpansion }) => {
  return (
    <div className="bg-base-200 overflow-hidden rounded-lg shadow-sm">
      {items.map((item, index) => (
        <div key={index} className="border-b last:border-b-0">
          <div
            className={`hover:bg-base-300 cursor-pointer p-3 transition-colors ${
              expandedItems[index] ? "bg-base-300" : ""
            }`}
            onClick={() => toggleItemExpansion(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-base-100 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={item.product.image}
                    alt={item.product.modelNo}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-semibold">{item.product.modelNo}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{item.product.category}</span>
                    <span>•</span>
                    <span>
                      ৳{item.price.toFixed(2)} × {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 font-semibold">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </span>
                {expandedItems[index] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
            </div>
          </div>

          {/* Expanded details */}
          {expandedItems[index] && (
            <div className="bg-base-100 border-t p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-gray-500">Product Details</p>
                  {item.product.brand && (
                    <p>
                      <span className="font-semibold">Brand:</span>{" "}
                      {item.product.brand}
                    </p>
                  )}
                  {item.product.specs &&
                    Object.entries(item.product.specs).map(
                      ([key, value], i) => (
                        <p key={i}>
                          <span className="font-semibold">{key}:</span> {value}
                        </p>
                      ),
                    )}
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Price Details</p>
                  <p>
                    <span className="font-semibold">Unit Price:</span> ৳
                    {item.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {item.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ৳
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
