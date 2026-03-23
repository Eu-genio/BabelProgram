import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./features/home/pages/HomePage";
import ProjectsPage from "./features/projects/pages/ProjectPage";
import TradingPage from "./features/trading/pages/TradingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "trading", element: <TradingPage /> },
    ],
  },
]);