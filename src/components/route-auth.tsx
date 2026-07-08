import { Outlet, Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";

function hasAuthSession(authState: {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}) {
  return Boolean(
    authState.isAuthenticated ||
    authState.accessToken ||
    authState.refreshToken,
  );
}

export function RequireAuth() {
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth);

  if (!hasAuthSession(authState)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const authState = useAppSelector((state) => state.auth);

  if (hasAuthSession(authState)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function RootRedirect() {
  const authState = useAppSelector((state) => state.auth);

  return (
    <Navigate
      to={hasAuthSession(authState) ? "/dashboard" : "/login"}
      replace
    />
  );
}
