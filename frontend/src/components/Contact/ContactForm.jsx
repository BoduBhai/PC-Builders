import { useState } from "react";
import axios from "../../lib/axios";
import Button from "../../components/ui/forms/Button";
import FormInput from "../../components/ui/forms/FormInput";
import useForm from "../../hooks/useForm";
import { validateContactForm } from "../../utils/validationUtils";

import {
  EmailIcon,
  UserIcon,
  MessageIcon,
  SubjectIcon,
  SuccessIcon,
  ErrorIcon,
} from "../../components/icons";

const ContactForm = () => {
  const [status, setStatus] = useState({
    success: null,
    error: null,
  });

  const submitContactForm = async (formValues) => {
    try {
      setStatus({ success: null, error: null });
      const response = await axios.post("/contact/send", formValues);

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
  } = useForm(
    {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    submitContactForm,
    validateContactForm,
  );

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-5">
      <div className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="border-primary flex w-full max-w-lg flex-col gap-4 rounded-lg border-1 p-5 text-center shadow-xl"
        >
          <h1 className="mb-5 text-3xl font-bold">Contact Us</h1>

          {status.success && (
            <div className="alert alert-success">
              <SuccessIcon className="h-6 w-6 shrink-0 stroke-current" />
              <span>{status.success}</span>
            </div>
          )}

          {status.error && (
            <div className="alert alert-error">
              <ErrorIcon className="h-6 w-6 shrink-0 stroke-current" />
              <span>{status.error}</span>
            </div>
          )}

          <FormInput
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Your Name"
            icon={<UserIcon />}
            required
            error={errors.name}
          />

          <FormInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Your Email"
            icon={<EmailIcon />}
            required
            error={errors.email}
          />

          <FormInput
            type="text"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            placeholder="Subject (Optional)"
            icon={<SubjectIcon />}
            error={errors.subject}
          />

          <div className="form-control w-full">
            <label
              className={`input input-textarea flex min-h-24 w-full items-start ${errors.message ? "input-error" : ""}`}
            >
              <span className="mt-2 h-[1em] opacity-50">
                <MessageIcon />
              </span>
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="min-h-20 w-full flex-1 focus:outline-none"
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
    </section>
  );
};

export default ContactForm;
