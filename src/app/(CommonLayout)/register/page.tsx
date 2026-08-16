"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone, faLocationDot, faShieldHeart } from "@fortawesome/free-solid-svg-icons";
import Logo from "@/components/shared/Logo";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Label, Input, Textarea, HelperText } from "@/components/ui/Field";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    address: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const [register, { isLoading, error }] = useRegisterMutation();
  const router = useRouter();

  // Phone number regex: starts with "01" followed by 9 digits
  const phoneRegex = /^01\d{9}$/;

  // Log error from useRegisterMutation when it changes
  useEffect(() => {
    if (error) {
      let msg: string;

      // Type guard to check if error has a 'data' property (FetchBaseQueryError)
      if ('data' in error && error.data && typeof error.data === 'object') {
        const errorData = error.data as { errorSources?: Array<{ message: string }>; message?: string };

        console.log("R:", errorData?.errorSources);
        if (errorData?.errorSources && errorData.errorSources.length > 0) {
          msg = errorData.errorSources[0].message;
        } else {
          msg = errorData?.message || 'Unknown error';
        }
      } else {
        // Fallback for SerializedError or other error types
        msg = 'An unexpected error occurred';
      }

      toast.error(`Registration failed | ${msg}`);
    }
  }, [error]);

  const validatePhone = (phone: string): string => {
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with '01' and be 11 digits long (e.g., 01712345678)";
    }
    return "";
  };

  const validateAddress = (address: string): string => {
    if (address.length < 5) {
      return "Address must be at least 5 characters long";
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setApiError(null); // Clear API error on input change

    // Validate fields on change
    if (name === "phone") {
      setValidationErrors((prev) => ({
        ...prev,
        phone: validatePhone(value),
      }));
    } else if (name === "address") {
      setValidationErrors((prev) => ({
        ...prev,
        address: validateAddress(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const phoneError = validatePhone(formData.phone);
    const addressError = validateAddress(formData.address);

    setValidationErrors({
      phone: phoneError,
      address: addressError,
    });

    if (phoneError || addressError) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      const result = await register(formData).unwrap();
      if (result.success) {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      console.log("Registration failed:", error);
    }
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
            <h2 className="font-display text-2xl font-semibold text-ink">Create Your Account</h2>
            <p className="mt-1 text-sm text-muted">Start your pharmacy record</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </span>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="pl-10"
                />
              </div>
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                </span>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.phone}
                  placeholder="e.g., 01712345678"
                  className="pl-10"
                />
              </div>
              <HelperText error={!!validationErrors.phone}>
                {validationErrors.phone || "Bangladesh format: starts with 01, 11 digits total."}
              </HelperText>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-3 text-muted">
                  <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
                </span>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  error={!!validationErrors.address}
                  className="pl-10"
                />
              </div>
              {validationErrors.address && (
                <HelperText error>{validationErrors.address}</HelperText>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          {apiError && <HelperText error>{apiError}</HelperText>}

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-pharmacy hover:underline">
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
