
"use client";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/utils/verifyToken";
import { setUser, TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";

// Define a custom error type to handle RTK Query error shapes
interface LoginError {
  data?: {
    message?: string;
  };
  message?: string; // Fallback for SerializedError
}

interface LoginFormData {
  emailOrPhone: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userInfo = loginType === "email"
        ? { email: data.emailOrPhone, password: data.password }
        : { phone: data.emailOrPhone, password: data.password };

      const res = await login(userInfo).unwrap();
      const user = verifyToken(res.data.accessToken) as TUser;

      if (res.data.accessToken) {
        dispatch(setUser({ user, token: res.data.accessToken }));
        toast("✅ Logged in successfully");
        router.push("/");
      } else {
        toast("❌ Gained Token not valid");
      }
    } catch (err) {
      const error = err as LoginError;
      console.error("Login failed:", err);
      toast(
        `❌ Login failed: ${error.data?.message || error.message || "Unknown error"}`
      );
    }
  };

  // Handle demo user login
  const handleDemoUser = () => {
    setLoginType("email");
    setValue("emailOrPhone", "akib@finemed.com");
    setValue("password", "akib@finemed");
  };

  // Handle demo admin login
  const handleDemoAdmin = () => {
    setLoginType("email");
    setValue("emailOrPhone", "admin@finemed.com");
    setValue("password", "admin@finemed");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] bg-gray-100">
      <Link href="/">
        <h3 className="text-3xl font-bold text-gray-500 mb-5">
          <span className="text-[#16a085]">Fine</span>Med
        </h3>
      </Link>
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold my-6 text-teal-600 text-center">
            Log In
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          <div>
            {/* Demo User and Demo Admin Buttons */}
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={handleDemoUser}
                className="px-4 py-2 text-sm font-medium rounded-lg transition duration-200 bg-teal-100 text-teal-700 hover:bg-teal-200"
                aria-label="Login with demo user credentials"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="px-4 py-2 text-sm font-medium rounded-lg transition duration-200 bg-teal-100 text-teal-700 hover:bg-teal-200"
                aria-label="Login with demo admin credentials"
              >
                Demo Admin
              </button>
            </div>

            {/* Email/Phone Toggle Buttons */}
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                  loginType === "email"
                    ? "bg-teal-500 text-white"
                    : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType("phone")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                  loginType === "phone"
                    ? "bg-teal-500 text-white"
                    : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                }`}
              >
                Phone Number
              </button>
            </div>
            <label
              htmlFor="emailOrPhone"
              className="block text-sm font-medium text-teal-700"
            >
              {loginType === "email" ? "Email" : "Phone Number"}
            </label>
            <input
              id="emailOrPhone"
              type={loginType === "email" ? "text" : "tel"}
              {...register("emailOrPhone", {
                required: `${
                  loginType === "email" ? "Email" : "Phone Number"
                } is required`,
                pattern: loginType === "email"
                  ? {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    }
                  : {
                      value: /^01\d{9}$/,
                      message: "Invalid phone number",
                    },
              })}
              autoComplete="off"
              placeholder={
                loginType === "email"
                  ? "e.g., user@example.com"
                  : "e.g., 01712345678"
              }
              className="w-full px-4 py-2 mt-1 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
            />
            {errors.emailOrPhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.emailOrPhone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-teal-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 mt-1 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("remember")}
                className="text-teal-600 border-teal-300 rounded focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-teal-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-teal-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-700 transition duration-200 disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-teal-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-teal-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
