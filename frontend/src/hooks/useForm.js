import { useState } from "react";

const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (e.g., address.street)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setValues({
        ...values,
        [parent]: {
          ...values[parent],
          [child]: value,
        },
      });
    } else {
      // Handle regular fields
      setValues({
        ...values,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validate if validation function provided
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // If there are errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = (field, value) => {
    // Handle nested objects for setFieldValue as well
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setValues({
        ...values,
        [parent]: {
          ...values[parent],
          [child]: value,
        },
      });
    } else {
      setValues({
        ...values,
        [field]: value,
      });
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    setErrors,
  };
};

export default useForm;
