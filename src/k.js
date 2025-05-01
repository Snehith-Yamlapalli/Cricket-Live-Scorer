import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}>
                About
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
