import React from "react";

/**
 * Reusable button component with various styles and states
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, success, error, warning, info)
 * @param {string} props.size - Button size (xs, sm, md, lg)
 * @param {boolean} props.outline - Whether to use outline style
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.block - Whether button should take full width
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  variant = "primary",
  size = "md",
  outline = false,
  loading = false,
  disabled = false,
  block = false,
  type = "button",
  onClick,
  children,
  className = "",
  ...rest
}) => {
  // Generate button classes based on props
  const getButtonClasses = () => {
    const baseClasses = "btn";
    const variantClass = outline
      ? `btn-outline btn-${variant}`
      : `btn-${variant}`;
    const sizeClass = size !== "md" ? `btn-${size}` : "";
    const blockClass = block ? "btn-block" : "";

    return `${baseClasses} ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim();
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
