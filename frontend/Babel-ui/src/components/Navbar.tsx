import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/Login">Login</Link>
            <Link to="/About">About</Link>
        </nav>
    );
}

export default Navbar;