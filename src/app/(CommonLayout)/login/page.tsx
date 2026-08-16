
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLock, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import Logo from "@/components/shared/Logo";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Label, Input, HelperText } from "@/components/ui/Field";

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
        toast.success("Logged in successfully");
        router.push("/");
      } else {
        toast.error("Gained Token not valid");
      }
    } catch (err) {
      const error = err as LoginError;
      console.error("Login failed:", err);
      toast.error(
        `Login failed: ${error.data?.message || error.message || "Unknown error"}`
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
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-paper px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rx-pad pointer-events-none absolute -inset-3 -z-10 rounded-2xl opacity-60" />
        <Card padding="lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
              <FontAwesomeIcon icon={faShieldHeart} className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">Log In</h2>
            <p className="mt-1 text-sm text-muted">Access your pharmacy record</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
            {/* Demo User and Demo Admin Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoUser}
                aria-label="Login with demo user credentials"
              >
                Demo User
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoAdmin}
                aria-label="Login with demo admin credentials"
              >
                Demo Admin
              </Button>
            </div>

            {/* Email/Phone Toggle Buttons */}
            <div className="flex gap-2 rounded-full bg-paper-deep p-1">
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  loginType === "email"
                    ? "bg-pharmacy text-white"
                    : "text-ink-soft hover:bg-surface"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType("phone")}
                className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  loginType === "phone"
                    ? "bg-pharmacy text-white"
                    : "text-ink-soft hover:bg-surface"
                }`}
              >
                Phone Number
              </button>
            </div>

            <div>
              <Label htmlFor="emailOrPhone">
                {loginType === "email" ? "Email" : "Phone Number"}
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <FontAwesomeIcon icon={loginType === "email" ? faEnvelope : faPhone} className="h-4 w-4" />
                </span>
                <Input
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
                  error={!!errors.emailOrPhone}
                  className="pl-10"
                />
              </div>
              {errors.emailOrPhone && (
                <HelperText error>{errors.emailOrPhone.message}</HelperText>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                </span>
                <Input
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
                  error={!!errors.password}
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <HelperText error>{errors.password.message}</HelperText>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 rounded border-border text-pharmacy focus:ring-pharmacy"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-pharmacy hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Don&rsquo;t have an account?{" "}
            <Link href="/register" className="font-medium text-pharmacy hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
