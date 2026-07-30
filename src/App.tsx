import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { adminRoutes } from "./routes";
import { Suspense } from "react";
import "./App.css";
import { RequireAuth, RedirectIfAuthenticated, RootRedirect } from "./components/route-auth";
import LoadingScreen from "./components/LoadingScreen";
import { RouterErrorFallback } from "./pages/ErrorPage";

const router = createBrowserRouter([
  { path: "/", element: <RootRedirect />, errorElement: <RouterErrorFallback /> },
  {
    element: <RedirectIfAuthenticated />,
    errorElement: <RouterErrorFallback />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <RequireAuth />,
    errorElement: <RouterErrorFallback />,
    children: adminRoutes,
  },
]);

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
