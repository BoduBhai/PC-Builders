import { useState, useEffect } from "react";

export const useComponentFilter = (
  products,
  activeModal,
  searchTerm,
  getCategoryForComponentType,
) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!activeModal) return;

    let componentCategory = getCategoryForComponentType(activeModal);

    const filtered = products.filter((product) => {
      // Filter by category first
      const categoryMatch = componentCategory
        ? product.category
            .toLowerCase()
            .includes(componentCategory.toLowerCase())
        : true;

      // Then filter by search term if present
      const searchMatch = searchTerm
        ? product.modelNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        : true;

      return categoryMatch && searchMatch;
    });

    setFilteredProducts(filtered);
  }, [activeModal, searchTerm, products, getCategoryForComponentType]);

  return filteredProducts;
};
