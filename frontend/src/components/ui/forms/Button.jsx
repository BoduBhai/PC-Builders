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
