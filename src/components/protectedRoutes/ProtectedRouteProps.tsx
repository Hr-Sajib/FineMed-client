// components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = useSelector(useCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ensures window is available
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!token) {
      window.location.href = "/login"; // redirects to login
      return;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
      window.location.href = "/login"; // redirects to login
    }
  }, [isClient, token, user, allowedRoles]);

  if (!token || !isClient) return null;

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) return null;

  return <>{children}</>;
};
