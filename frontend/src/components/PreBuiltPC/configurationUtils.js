// Configuration utility functions for pre-built PC page

// Required component types for different PC builds
export const requiredComponents = {
  gaming: [
    "processor",
    "motherboard",
    "graphicsCard",
    "ram1",
    "ssd",
    "powerSupply",
    "casing",
    "cpuCooler",
  ],
  productivity: [
    "processor",
    "motherboard",
    "graphicsCard",
    "ram1",
    "ram2",
    "ssd",
    "hdd",
    "powerSupply",
    "casing",
    "cpuCooler",
  ],
  regular: ["processor", "motherboard", "ram1", "ssd", "powerSupply", "casing"],
};

// Budget ranges for different PC types
export const budgetRanges = {
  gaming: {
    budget: { name: "Budget Gaming", minPrice: 30000, maxPrice: 50000 },
    midRange: { name: "Mid-Range Gaming", minPrice: 50001, maxPrice: 70000 },
    highEnd: { name: "High-End Gaming", minPrice: 70001, maxPrice: 120000 },
  },
  productivity: {
    budget: { name: "Budget Workstation", minPrice: 25000, maxPrice: 40000 },
    midRange: {
      name: "Mid-Range Workstation",
      minPrice: 40001,
      maxPrice: 60000,
    },
    highEnd: {
      name: "High-End Workstation",
      minPrice: 60001,
      maxPrice: 80000,
    },
  },
  regular: {
    budget: { name: "Budget Home/Office", minPrice: 30000, maxPrice: 45000 },
    midRange: {
      name: "Mid-Range Home/Office",
      minPrice: 45001,
      maxPrice: 65000,
    },
    highEnd: {
      name: "High-End Home/Office",
      minPrice: 65001,
      maxPrice: 90000,
    },
  },
};

// PC type descriptions
export const typeDescriptions = {
  gaming:
    "Optimized for gaming performance with powerful graphics cards and processors",
  productivity:
    "Built for demanding tasks like video editing, 3D rendering, and software development",
  regular:
    "Perfect for everyday computing, web browsing, and office applications",
};

// Generate configurations based on selected type, budget, and product list
export const generateConfigurations = (products, categoryMappings) => {
  if (!products || products.length === 0) return {};

  // Filter products by category first
  const categorizedProducts = {};
  Object.keys(categoryMappings).forEach((componentType) => {
    const category = categoryMappings[componentType];
    categorizedProducts[category] = products.filter(
      (product) => product.category === category && product.stock > 0,
    );
  });

  // Map component types to their respective categories
  const getProductsByComponentType = (componentType) => {
    const category = categoryMappings[componentType];
    return categorizedProducts[category] || [];
  };

  // Function to find the best product for each component type based on budget
  const findBestProductForComponent = (componentType, budgetRange, pcType) => {
    const products = getProductsByComponentType(componentType);
    if (!products.length) return null;

    const { minPrice, maxPrice } = budgetRanges[pcType][budgetRange];

    // Sort products by price (using discounted price if available)
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.onDiscount ? a.discountPrice : a.price;
      const priceB = b.onDiscount ? b.discountPrice : b.price;
      return priceA - priceB;
    });

    // Different selection strategies based on PC type and component
    if (pcType === "gaming" && componentType === "graphicsCard") {
      // For gaming PCs, allocate more budget to the graphics card
      const targetPrice = maxPrice * (budgetRange === "highEnd" ? 0.35 : 0.3);
      return (
        sortedProducts.find((p) => {
          const price = p.onDiscount ? p.discountPrice : p.price;
          return price <= targetPrice;
        }) || sortedProducts[0]
      );
    } else if (pcType === "productivity" && componentType === "processor") {
      // For productivity, prioritize CPU
      const targetPrice = maxPrice * (budgetRange === "highEnd" ? 0.25 : 0.2);
      return (
        sortedProducts.find((p) => {
          const price = p.onDiscount ? p.discountPrice : p.price;
          return price <= targetPrice;
        }) || sortedProducts[0]
      );
    }

    // Default selection strategy based on price range
    const midPoint = (minPrice + maxPrice) / 2;
    const modifier = {
      processor: 0.2,
      motherboard: 0.12,
      graphicsCard: 0.25,
      ram1: 0.08,
      ram2: 0.08,
      ssd: 0.1,
      powerSupply: 0.1,
      casing: 0.07,
      cpuCooler: 0.05,
      hdd: 0.05,
      monitor: 0.15,
      mouse: 0.03,
      keyboard: 0.03,
      headphone: 0.03,
      caseFan: 0.02,
    };

    // Calculate target price for component based on importance
    const targetPrice = midPoint * (modifier[componentType] || 0.1);

    // Find closest match to target price
    let bestMatch = sortedProducts[0];
    let minDiff = Infinity;

    for (const product of sortedProducts) {
      const price = product.onDiscount ? product.discountPrice : product.price;
      const diff = Math.abs(price - targetPrice);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = product;
      }
    }

    return bestMatch;
  };

  // Generate configurations for all PC types and budget ranges
  const configurations = {};

  Object.keys(budgetRanges).forEach((pcType) => {
    configurations[pcType] = {};

    Object.keys(budgetRanges[pcType]).forEach((budget) => {
      const config = {};
      let totalPrice = 0;

      // Get required components for this PC type
      requiredComponents[pcType].forEach((componentType) => {
        const selectedProduct = findBestProductForComponent(
          componentType,
          budget,
          pcType,
        );
        if (selectedProduct) {
          config[componentType] = selectedProduct;
          totalPrice += selectedProduct.onDiscount
            ? selectedProduct.discountPrice
            : selectedProduct.price;
        }
      });

      configurations[pcType][budget] = {
        components: config,
        totalPrice: totalPrice,
      };
    });
  });

  return configurations;
};

// Generate a custom budget configuration
export const generateCustomConfiguration = ({
  products,
  customBudget,
  selectedType,
  componentCategoryMapping,
}) => {
  if (!products || products.length === 0 || customBudget <= 0) return null;

  // Filter products by category
  const categorizedProducts = {};
  Object.keys(componentCategoryMapping).forEach((componentType) => {
    const category = componentCategoryMapping[componentType];
    categorizedProducts[category] = products.filter(
      (product) => product.category === category && product.stock > 0,
    );
  });

  // Map component types to their respective categories
  const getProductsByComponentType = (componentType) => {
    const category = componentCategoryMapping[componentType];
    return categorizedProducts[category] || [];
  };

  const config = {};
  let remainingBudget = customBudget;
  let totalPrice = 0;

  // Budget allocation ratios based on PC type
  const budgetAllocations = {
    gaming: {
      processor: 0.2,
      graphicsCard: 0.3,
      motherboard: 0.12,
      ram1: 0.08,
      ssd: 0.1,
      powerSupply: 0.08,
      casing: 0.07,
      cpuCooler: 0.05,
    },
    productivity: {
      processor: 0.25,
      motherboard: 0.12,
      graphicsCard: 0.2,
      ram1: 0.08,
      ram2: 0.07,
      ssd: 0.1,
      hdd: 0.05,
      powerSupply: 0.07,
      casing: 0.06,
      cpuCooler: 0.05,
    },
    regular: {
      processor: 0.22,
      motherboard: 0.15,
      ram1: 0.12,
      ssd: 0.2,
      powerSupply: 0.15,
      casing: 0.16,
    },
  };

  // Get required components for this PC type
  const componentList = requiredComponents[selectedType];

  // First pass: determine budget for each component
  const componentBudgets = {};
  componentList.forEach((componentType) => {
    componentBudgets[componentType] =
      customBudget * (budgetAllocations[selectedType][componentType] || 0.1);
  });

  // Second pass: select components within budget
  componentList.forEach((componentType) => {
    const products = getProductsByComponentType(componentType);
    if (!products.length) return;

    // Sort by price (using discounted price if available)
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.onDiscount ? a.discountPrice : a.price;
      const priceB = b.onDiscount ? b.discountPrice : b.price;
      return priceA - priceB;
    });

    // Find product closest to budget allocation without exceeding it
    const targetBudget = componentBudgets[componentType];
    let bestProduct = null;
    let bestScore = Infinity;

    for (const product of sortedProducts) {
      const price = product.onDiscount ? product.discountPrice : product.price;

      // If price is within budget, calculate how close it is to target allocation
      if (price <= targetBudget) {
        const score = targetBudget - price; // Lower is better (closer to target)
        if (score < bestScore) {
          bestScore = score;
          bestProduct = product;
        }
      }
    }

    // If no product fits the budget, take the cheapest one
    if (!bestProduct && sortedProducts.length > 0) {
      bestProduct = sortedProducts[0];
    }

    if (bestProduct) {
      config[componentType] = bestProduct;
      const price = bestProduct.onDiscount
        ? bestProduct.discountPrice
        : bestProduct.price;
      totalPrice += price;
      remainingBudget -= price;
    }
  });

  // Optional quality improvements if we have remaining budget
  if (remainingBudget > 50) {
    // Try to upgrade components with remaining budget
    const upgradeOrder = [
      "processor",
      "graphicsCard",
      "ssd",
      "ram1",
      "motherboard",
    ];

    for (const componentType of upgradeOrder) {
      if (!config[componentType] || remainingBudget < 50) continue;

      const currentProduct = config[componentType];
      const currentPrice = currentProduct.onDiscount
        ? currentProduct.discountPrice
        : currentProduct.price;
      const products = getProductsByComponentType(componentType);

      // Find potential upgrades that fit in remaining budget
      const possibleUpgrades = products.filter((p) => {
        const price = p.onDiscount ? p.discountPrice : p.price;
        return price > currentPrice && price <= currentPrice + remainingBudget;
      });

      // Select the best upgrade within budget
      if (possibleUpgrades.length > 0) {
        // Sort by price in descending order (most expensive first, but still in budget)
        const bestUpgrade = [...possibleUpgrades].sort((a, b) => {
          const priceA = a.onDiscount ? a.discountPrice : a.price;
          const priceB = b.onDiscount ? b.discountPrice : b.price;
          return priceB - priceA;
        })[0];

        // Apply the upgrade
        const upgradePrice = bestUpgrade.onDiscount
          ? bestUpgrade.discountPrice
          : bestUpgrade.price;
        const priceDifference = upgradePrice - currentPrice;

        if (priceDifference <= remainingBudget) {
          config[componentType] = bestUpgrade;
          totalPrice = totalPrice - currentPrice + upgradePrice;
          remainingBudget -= priceDifference;
        }
      }
    }
  }

  return {
    components: config,
    totalPrice: totalPrice,
    name: `Custom ${selectedType === "gaming" ? "Gaming" : selectedType === "productivity" ? "Workstation" : "Home/Office"} Build`,
    targetBudget: customBudget,
  };
};
