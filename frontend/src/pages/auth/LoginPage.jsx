import { Link } from "react-router-dom";

import { useUserStore } from "../../stores/useUserStore";
import useForm from "../../hooks/useForm";

import FormInput from "../../components/ui/forms/FormInput";
import Button from "../../components/ui/forms/Button";
import { EmailIcon, PasswordIcon } from "../../components/icons";

const LoginPage = () => {
  const { login, loading } = useUserStore();

  const { values, handleChange, handleSubmit } = useForm(
    {
      email: "",
      password: "",
    },
    (values) => login(values.email, values.password),
  );

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-5">
      <section className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="border-primary flex w-full max-w-sm flex-col gap-4 rounded-lg border-1 p-5 text-center shadow-xl"
        >
          <h1 className="mb-5 text-3xl font-bold">Log In</h1>

          <FormInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="mail@site.com"
            icon={<EmailIcon />}
            required
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
          />

          <Button type="submit" variant="success" block loading={loading}>
            Log in
          </Button>
        </form>
      </section>
      <p className="text-md text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-success hover:text-primary/80 font-semibold underline transition-colors"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;
