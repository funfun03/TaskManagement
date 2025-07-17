import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { login } from "../services";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { LoginContext } from "../context/context";
import { apiClient } from "../libraries/api-client";
import { useAuthStore } from "../useAuthStore";

interface IFormInput {
  username: string;
  password: string;
}

const validationSchema: yup.ObjectSchema<IFormInput> = yup.object({
  username: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters long")
    .max(50, "Email must not exceed 50 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must not exceed 50 characters"),
});

const Login = () => {
  // const { setUser } = useContext(LoginContext);
  const navigate = useNavigate();
  const { login } = useAuthStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      username: "tungnt@softech.vn",
      password: "123456789",
    },
  });

  const onSubmit = async (data: IFormInput): Promise<void> => {
    try {
      await login({
        username: data.username,
        password: data.password,
        navigate,
      });
      // navigate("/tasks");
      // const user = await login(data.username, data.password);
      // setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-strong p-8 hover-lift">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : !errors.username && dirtyFields.username
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Enter your email"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : !errors.password && dirtyFields.password
                    ? "border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isSubmitting || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-primary hover:scale-[1.02] shadow-medium hover:shadow-strong"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <p
                className={`text-sm ${
                  isValid ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isValid ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-1">✓</span>
                    Ready to sign in
                  </span>
                ) : (
                  "Please fill in all required fields"
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
