import { useEffect, useState } from "react";
import './App.css'
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

    return (
  <>
  <Router>
    <Navbar />
    <AppRoutes />
  </Router>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>API status: {}</p>
      </div>
  </>

  );
}

export default App;