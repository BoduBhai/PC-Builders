import React from "react";

/**
 * Reusable form input component
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.name - Input name (for form state)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.label - Label text
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.className - Additional CSS classes
 */
const FormInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  error,
  icon,
  className = "",
  ...rest
}) => {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
          {required && <span className="text-error">*</span>}
        </label>
      )}

      <label className={`input w-full ${error ? "input-error" : ""}`}>
        {icon && <span className="h-[1em] opacity-50">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full"
          {...rest}
        />
      </label>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default FormInput;
