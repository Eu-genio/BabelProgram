import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import UsersPage from "../pages/UsersPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />}/>
      <Route path="/About" element={<About />}/>      
      <Route path="/UsersPage" element={<UsersPage />} />
    </Routes>
  );
}
export default AppRoutes;