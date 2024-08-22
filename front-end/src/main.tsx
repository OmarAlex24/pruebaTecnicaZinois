import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NavigateToLogin from "./components/NavigateToLogin";

const isAuthenticated = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="));
  return !!token;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: isAuthenticated() ? <Home /> : <NavigateToLogin />,
  },
  {
    path: "*",
    element: <NavigateToLogin />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
