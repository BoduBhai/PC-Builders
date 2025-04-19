import { useState } from "react";
import axios from "../../lib/axios";
import useForm from "../../hooks/useForm";
import FormInput from "../../components/ui/forms/FormInput";
import Button from "../../components/ui/forms/Button";

const ContactForm = () => {
  const [status, setStatus] = useState({
    success: null,
    error: null,
  });

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    if (!values.email) errors.email = "Email is required";
    if (values.email && !/\S+@\S+\.\S+/.test(values.email))
      errors.email = "Email is invalid";
    if (!values.message) errors.message = "Message is required";
    return errors;
  };

  const submitForm = async (values) => {
    try {
      setStatus({ success: null, error: null });

      const response = await axios.post("/contact/send", values);

      setStatus({
        success: response.data.message,
        error: null,
      });

      resetForm();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus({
        success: null,
        error:
          error.response?.data?.message ||
          "Failed to send message. Please try again later.",
      });
    }
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useForm(initialValues, submitForm, validate);

  // Define icons for inputs
  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </g>
    </svg>
  );

  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </g>
    </svg>
  );

  const messageIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </g>
    </svg>
  );

  const subjectIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
        <path d="M12 11.5v-2"></path>
        <path d="M12 15.5h.01"></path>
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <div className="mt-35 flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col gap-4 rounded-lg border-2 border-gray-200 p-5 text-center shadow-xl"
        >
          <h1 className="mb-5 text-3xl font-bold">Contact Us</h1>

          {status.success && (
            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{status.success}</span>
            </div>
          )}

          {status.error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{status.error}</span>
            </div>
          )}

          <FormInput
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Your Name"
            icon={userIcon}
            required
            error={errors.name}
          />

          <FormInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Your Email"
            icon={emailIcon}
            required
            error={errors.email}
          />

          <FormInput
            type="text"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            placeholder="Subject (Optional)"
            icon={subjectIcon}
            error={errors.subject}
          />

          <div className="form-control w-full">
            <label
              className={`input input-textarea min-h-24 ${errors.message ? "input-error" : ""}`}
            >
              <span className="h-[1em] opacity-50">{messageIcon}</span>
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="min-h-20 w-full resize-y"
              ></textarea>
            </label>

            {errors.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.message}
                </span>
              </label>
            )}
          </div>

          <Button type="submit" variant="success" block loading={isSubmitting}>
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
