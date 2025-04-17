import React from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import FormInput from "../../components/ui/forms/FormInput";
import Button from "../../components/ui/forms/Button";
import useForm from "../../hooks/useForm";

const LoginPage = () => {
  const { login, loading } = useUserStore();

  // Initialize useForm hook
  const { values, handleChange, handleSubmit } = useForm(
    {
      email: "",
      password: "",
    },
    (values) => login(values.email, values.password),
  );

  // Icons for inputs
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

  const passwordIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="none"
        stroke="currentColor"
      >
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <div className="mt-35 flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4 rounded-lg border-2 border-gray-200 p-5 text-center shadow-xl"
        >
          <h1 className="mb-5 text-3xl font-bold">Log In</h1>

          <FormInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="mail@site.com"
            icon={emailIcon}
            required
          />

          <FormInput
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Password"
            icon={passwordIcon}
            required
            minLength="6"
          />

          <Button type="submit" variant="success" block loading={loading}>
            Log in
          </Button>
        </form>
      </div>
      <p className="text-md text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-success font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
