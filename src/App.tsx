import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { adminRoutes } from "./routes";
import { Suspense } from "react";
import "./App.css";
import { RequireAuth, RedirectIfAuthenticated, RootRedirect } from "./components/route-auth";

const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    element: <RedirectIfAuthenticated />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: adminRoutes,
  },
]);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
