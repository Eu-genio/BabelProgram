import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import BabelAppLayout from "./features/babel/layout/BabelAppLayout";
import DashboardPage from "./features/babel/pages/DashboardPage";
import PortfolioPage from "./features/babel/pages/PortfolioPage";
import MarketsPage from "./features/babel/pages/MarketsPage";
import OrdersPage from "./features/babel/pages/OrdersPage";
import WatchlistPage from "./features/babel/pages/WatchlistPage";
import SettingsPage from "./features/babel/pages/SettingsPage";
import HomePage from "./features/home/pages/HomePage";
import AboutPage from "./features/home/pages/AboutPage";
import ExperiencePage from "./features/home/pages/ExperiencePage";
import SkillsPage from "./features/home/pages/SkillsPage";
import ProjectsPage from "./features/projects/pages/ProjectPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "experience", element: <ExperiencePage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "market", element: <Navigate to="/trading/markets" replace /> },
      {
        path: "trading",
        element: (
          <ProtectedRoute>
            <BabelAppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "portfolio", element: <PortfolioPage /> },
          { path: "markets", element: <MarketsPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "watchlist", element: <WatchlistPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);