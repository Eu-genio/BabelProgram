import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />}/>
      <Route path="/About" element={<About />}/>      
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  );
}
export default AppRoutes;