import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { auth } from './components/firebase';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import ProfileLayout from './components/PriofileLayout';

import Base from './CricApp/Base'
import BBL from './CricApp/BBL';
import Scorecard from './CricApp/Scorecard';
import NewBatsman from './CricApp/NewBatsman';
import NewBowler from './CricApp/NewBowler';
import History from './CricApp/History';
import Over from './CricApp/Over';
import NBB from './CricApp/NBB';
import LiveScore from './CricApp/LiveScore';
import LiveScoreCard from './CricApp/LiveScoreCard';
import International from './CricApp/International';
import IScorecard from './CricApp/IScorecard';
import MatchSetupPage from './features/match/pages/MatchSetupPage';
import LineupPage from './features/match/pages/LineupPage';
import ScorerPage from './features/match/pages/ScorerPage';
import ChangePlayerPage from './features/match/pages/ChangePlayerPage';
import ScorecardPage from './features/match/pages/ScorecardPage';
import { InningsBreakPage, ResultPage } from './features/match/pages/MatchStatusPages';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Track Firebase auth loading

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  if (loading) return <p>Loading...</p>; // Optional: replace with spinner

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/Base" /> : <Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={user ? <Profile /> : <Navigate to="/" />} />
          {user && (
            <Route element={<ProfileLayout />}>
              <Route path="/Home" element={<MatchSetupPage />} />
              <Route path="/matches/:matchId/lineup/:innings" element={<LineupPage />} />
              <Route path="/scorecard/:matchId" element={<ScorerPage />} />
              <Route path="/matches/:matchId/change-batter" element={<ChangePlayerPage type="batter" />} />
              <Route path="/matches/:matchId/change-bowler" element={<ChangePlayerPage type="bowler" />} />
              <Route path="/matches/:matchId/innings-break" element={<InningsBreakPage />} />
              <Route path="/matches/:matchId/result" element={<ResultPage />} />
              <Route path="/scorecard/:matchId/full" element={<ScorecardPage />} />
              <Route path="/Base" element={<Base />} />
              <Route path="/International" element={<International />} />
              <Route path="/IScorecard" element={<IScorecard />} />
              <Route path="/BBL" element={<BBL />} />
              <Route path="/NBB" element={<NBB />} />
              <Route path="/Over" element={<Over />} />
              <Route path="/scorecard" element={<Scorecard />} />
              <Route path="/history" element={<History />} />
              <Route path="/NewBowler" element={<NewBowler />} />
              <Route path="/NewBatsman" element={<NewBatsman />} />
              <Route path="/livescore/:matchId" element={<LiveScore />} />
              <Route path="/livescoreCard/:matchId" element={<LiveScoreCard />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
