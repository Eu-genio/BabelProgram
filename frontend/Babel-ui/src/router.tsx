import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./features/home/pages/HomePage";
import ProjectsPage from "./features/projects/pages/ProjectPage";
import TradingPage from "./features/trading/pages/TradingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "trading", element: <ProtectedRoute><TradingPage /></ProtectedRoute> },
      { path: "login", element: <LoginPage/>}
    ],
  },
]);