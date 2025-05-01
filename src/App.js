import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import icon from './icon.jpeg';
// import Batsman from './Batsman';
// import Bowler from './Bowler';
import Scorecard from './Scorecard';
import Teams from './Teams';
import History from './History';
function App() {


  return (
    <div>
      <div className='row justify-content-center' id='head'>Cricket Live Scorer</div>
      <img src={icon} alt="pic" id='myicon' />
      <Router>
        <div className="App">
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/Home" end style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/Info" end style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}>
                  Info
                </NavLink>
              </li>
              <li>
                <NavLink to="/history" end style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}>
                  Teams History
                </NavLink>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/Home" element={<Teams />} />
            <Route path="/Info" element={<Scorecard />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
{/* */ }