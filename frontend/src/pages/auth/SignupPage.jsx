import { Link } from "react-router-dom";

import useForm from "../../hooks/useForm";
import { useUserStore } from "../../stores/useUserStore";
import { validateSignupForm } from "../../utils/validationUtils";

import FormInput from "../../components/ui/forms/FormInput";
import Button from "../../components/ui/forms/Button";
import {
  EmailIcon,
  PasswordIcon,
  UserIcon,
  PhoneIcon,
  PersonIcon,
  LockIcon,
} from "../../components/icons";

const SignupPage = () => {
  const { signup, loading } = useUserStore();

  const { values, handleChange, handleSubmit, errors } = useForm(
    {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    signup,
    validateSignupForm,
  );

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-5">
      <section className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="border-primary flex w-full max-w-sm flex-col gap-4 rounded-lg border-1 p-5 text-center shadow-xl"
        >
          <h1 className="mb-5 text-3xl font-bold">Create an account</h1>

          <FormInput
            type="text"
            name="fname"
            value={values.fname}
            onChange={handleChange}
            placeholder="First Name"
            icon={<UserIcon />}
            required
            pattern="[A-Za-z][A-Za-z\-]*"
            error={errors.fname}
          />

          <FormInput
            type="text"
            name="lname"
            value={values.lname}
            onChange={handleChange}
            placeholder="Last Name"
            icon={<PersonIcon />}
            required
            pattern="[A-Za-z][A-Za-z\-]*"
            error={errors.lname}
          />

          <FormInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="mail@site.com"
            icon={<EmailIcon />}
            required
            error={errors.email}
          />

          <FormInput
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Password"
            icon={<PasswordIcon />}
            required
            minLength="6"
            error={errors.password}
          />

          <FormInput
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            icon={<LockIcon />}
            required
            minLength="6"
            error={errors.confirmPassword}
          />

          <FormInput
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="Phone"
            icon={<PhoneIcon />}
            required
            pattern="[0-9]*"
            minLength="11"
            maxLength="11"
            error={errors.phone}
            className="tabular-nums"
          />

          <Button type="submit" variant="success" block loading={loading}>
            Sign Up
          </Button>
        </form>
      </section>
      <p className="text-md text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-success hover:text-primary/80 font-semibold underline transition-colors"
        >
          Login
        </Link>
      </p>
    </main>
  );
};

export default SignupPage;
