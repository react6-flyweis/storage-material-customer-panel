import Button from "@/components/common_components/Button";
import Input from "@/components/common_components/Input";
import bgImage from "@/assets/AuthBackgroundImg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/redux/api/authApi";
import { getApiErrorMessage } from "@/redux/utils/apiError";

const isPhoneNumber = (value: string) => {
  const normalizedValue = value.replace(/[\s()-]/g, "");

  return /^\+?\d{7,15}$/.test(normalizedValue);
};

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email or phone number is required.")
    .refine(
      (value) => z.email().safeParse(value).success || isPhoneNumber(value),
      {
        message: "Enter a valid email address or phone number.",
      },
    ),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      if (response.role !== "customer") {
        setError("root", { message: "Only customers are allowed to log in." });
        return;
      }
      navigate("/dashboard");
    } catch (unknownError) {
      setError("root", { message: getApiErrorMessage(unknownError) });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-125 bg-white rounded-[10px] shadow-2xl p-8 sm:p-10 md:p-12 relative z-10 mx-auto">
        <div className="text-center mb-10">
          <h1 className="md:text-2xl text-xl text-(--primary-color) sm:text-3xl font-medium mb-2">
            Sign In
          </h1>
          <p className="text-(--text-color-gray) text-sm sm:text-base">
            Let's build something great
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="E-mail or phone number"
            type="text"
            placeholder="Enter your email or phone"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <div className="space-y-1">
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>

          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}

          {errors.root && (
            <p className="text-sm text-red-600">{errors.root.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <div className="flex justify-end pt-2">
            <Link
              to="/forgot-password"
              className="text-sm font-normal text-(--primary-color) hover:opacity-80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
