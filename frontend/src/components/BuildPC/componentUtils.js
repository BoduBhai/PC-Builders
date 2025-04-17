// Category mappings for component types
export const categoryMappings = {
  processor: "Processor",
  motherboard: "Motherboard",
  graphicsCard: "Graphics Card",
  cpuCooler: "CPU Cooler",
  ram1: "RAM",
  ram2: "RAM",
  ssd: "SSD",
  hdd: "Hard Disk Drive",
  powerSupply: "Power Supply",
  casing: "Computer Case",
  monitor: "Monitor",
  caseFan: "Cooling Fan",
  mouse: "Mouse",
  keyboard: "Keyboard",
  headphone: "Headset",
};

// Component image source mappings
export const imageMappings = {
  processor: "/processor.avif",
  motherboard: "/mth.avif",
  graphicsCard: "/graphics-card.avif",
  cpuCooler: "/cooling-fan.avif",
  ram1: "/ram.avif",
  ram2: "/ram.avif",
  ssd: "/accessories.avif",
  hdd: "/accessories.avif",
  powerSupply: "/power-supply.avif",
  casing: "/case.avif",
  monitor: "/monitor.avif",
  caseFan: "/cooling-fan.avif",
  mouse: "/mouse.avif",
  keyboard: "/keyboard.avif",
  headphone: "/headset.avif",
};

// Component display names
export const componentNames = {
  processor: "Processor",
  motherboard: "Motherboard",
  graphicsCard: "Graphics Card",
  cpuCooler: "CPU Cooler",
  ram1: "RAM-1",
  ram2: "RAM-2",
  ssd: "SSD",
  hdd: "HDD",
  powerSupply: "Power Supply",
  casing: "Casing",
  monitor: "Monitor",
  caseFan: "Case Fan",
  mouse: "Mouse",
  keyboard: "Keyboard",
  headphone: "Headphone",
};

// Component categories
export const componentCategories = {
  coreComponents: [
    "processor",
    "motherboard",
    "graphicsCard",
    "cpuCooler",
    "ram1",
    "ram2",
    "ssd",
    "powerSupply",
    "casing",
  ],
  peripherals: ["monitor", "caseFan", "hdd"],
  accessories: ["mouse", "keyboard", "headphone"],
};

// Utility functions
export const getCategoryForComponentType = (componentType) => {
  return categoryMappings[componentType] || "";
};

export const getComponentImage = (componentType) => {
  return imageMappings[componentType] || "/accessories.avif";
};

export const getComponentName = (key) => {
  return componentNames[key] || key;
};
