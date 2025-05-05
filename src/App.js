import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BBL from './BBL';
import Scorecard from './Scorecard';
import NewBatsman from './NewBatsman';
import NewBowler from './NewBowler';
function App() {

  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/BBL" element={<BBL />} />
        <Route path="/scorecard" element={<Scorecard />} />
        <Route path="/NewBowler" element={<NewBowler />} />
        <Route path="/NewBatsman" element={<NewBatsman />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
