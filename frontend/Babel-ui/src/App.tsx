import { useEffect, useState } from "react";
import React from 'react';
import { getHealth } from "./lib/api";
import './App.css'
import Navbar from "./components/navbar";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Login = () => <h2>Login Page</h2>
const About = () => <h2>About Page</h2>
const Contact = () => <h2>Contact Page</h2>
function App() {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState("loading");
    useEffect(() => {
        getHealth()
            .then(data => setStatus(data.status))
            .catch(() => setStatus("error"));
    }, []);

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
        <p>API status: {status}</p>;
      </div>
  </>

  );
}

export default App;