export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    return new Date(dateString).toLocaleDateString("en-US", mergedOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
