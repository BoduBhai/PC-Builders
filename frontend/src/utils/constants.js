export const brandOptions = [
  "Acer",
  "AMD",
  "Apple",
  "Antec",
  "ASRock",
  "ASUS",
  "Cooler Master",
  "Corsair",
  "Coolermaster",
  "Colorful",
  "Deepcool",
  "Crucial",
  "Dell",
  "EVGA",
  "Fantech",
  "Gigabyte",
  "HP",
  "Intel",
  "Kingston",
  "Lenovo",
  "LG",
  "Logitech",
  "Microsoft",
  "MSI",
  "Noctua",
  "NZXT",
  "NVIDIA",
  "PNY",
  "Razer",
  "Samsung",
  "Sapphire",
  "Seagate",
  "Sony",
  "TEAM",
  "Thermaltake",
  "Toshiba",
  "Western Digital",
  "ZOTAC",
  "1stPlayer",
];

export const colorOptions = [
  "Black",
  "Blue",
  "Bronze",
  "Brown",
  "Gold",
  "Gray",
  "Green",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Silver",
  "White",
  "Yellow",
];

export const categoryOptions = [
  "Accessories",
  "Computer Case",
  "Cooling Fan",
  "CPU Cooler",
  "Custom Cooling Kit",
  "Graphics Card",
  "Gpu Vertical Mount",
  "Hard Disk Drive",
  "Headset",
  "Keyboard",
  "Laptop",
  "Mac",
  "Monitor",
  "Motherboard",
  "Mouse",
  "Optical Drive",
  "Portable HDD",
  "Portable SSD",
  "Power Supply",
  "Processor",
  "RAM",
  "SSD",
  "SSD Cooler",
];

export const featuredCategories = [
  {
    name: "Processor",
    image: "/processor.avif",
    description: "High-performance CPUs for your build",
  },
  {
    name: "Graphics Card",
    image: "/graphics-card.avif",
    description: "Powerful GPUs for gaming and content creation",
  },
  {
    name: "RAM",
    image: "/ram.avif",
    description: "Reliable memory modules for multitasking",
  },
  {
    name: "Motherboard",
    image: "/mth.avif",
    description: "Feature-rich boards for your components",
  },
  {
    name: "Case",
    image: "/case.avif",
    description: "Stylish and functional PC cases",
  },
  {
    name: "CPU Cooler",
    image: "/cooling-fan.avif",
    description: "Efficient cooling solutions for your processor",
  },
  {
    name: "Keyboard",
    image: "/keyboard.avif",
    description: "Mechanical and membrane keyboards for all needs",
  },
  {
    name: "Headset",
    image: "/headset.avif",
    description: "Premium audio experience for gaming and work",
  },
  {
    name: "Laptop",
    image: "/laptop.avif",
    description: "Portable computing power for on-the-go",
  },
  {
    name: "Mouse",
    image: "/mouse.avif",
    description: "Precision gaming and ergonomic mice options",
  },
  {
    name: "Cooling Fan",
    image: "/cooling-fan.avif",
    description: "Keep your components cool for optimal performance",
  },
  {
    name: "Accessories",
    image: "/accessories.avif",
    description: "Essential peripherals to complete your setup",
  },
];

/**
 * Format price with locale-specific formatting and currency symbol
 * @param {number} price - The price to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price, showDecimals = false) => {
  if (price === undefined || price === null) return "৳0";

  const formattedPrice = showDecimals
    ? price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : Math.round(price).toLocaleString();

  return `৳${formattedPrice}`;
};
