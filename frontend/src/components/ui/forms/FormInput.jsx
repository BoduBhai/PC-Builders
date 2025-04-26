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
        {icon && <span className="h-5 w-5">{icon}</span>}
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
