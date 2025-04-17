import React from "react";
import { Link } from "react-router-dom";
import ResponsiveImage from "../../components/ui/ResponsiveImage";
import { getComponentImage } from "../BuildPC/componentUtils";

const ComponentList = ({ components, totalPrice, componentDisplayNames }) => {
  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-semibold">Full Component List</h3>
      <div className="overflow-x-auto">
        <table className="table-zebra table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Model</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(components).map(([componentType, product]) => (
              <tr key={componentType}>
                <td className="flex items-center gap-2">
                  <div className="w-8">
                    <ResponsiveImage
                      src={getComponentImage(componentType)}
                      alt={componentType}
                      className="h-8 w-8"
                      objectFit="contain"
                    />
                  </div>
                  {componentDisplayNames[componentType]}
                </td>
                <td>
                  <Link
                    to={`/products/${product._id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {product.modelNo}
                  </Link>
                </td>
                <td className="text-right">
                  {product.onDiscount ? (
                    <div>
                      <span className="font-medium">
                        ৳{product.discountPrice.toFixed(2)}
                      </span>
                      <span className="ml-1 text-xs line-through opacity-60">
                        ৳{product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span>৳{product.price.toFixed(2)}</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={2}>Total</td>
              <td className="text-right">৳{totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentList;
