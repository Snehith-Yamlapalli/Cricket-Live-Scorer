import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const IScorecard = () => {
  const { state: data } = useLocation();

  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const matchinfo    = data.matchInfo;
  const matchscore1  = data.matchScore?.team1Score;
  const matchscore2  = data.matchScore?.team2Score;

  useEffect(() => {
    setTeam1(matchinfo?.team1?.teamName  || 'Team 1');
    setTeam2(matchinfo?.team2?.teamName  || 'Team 2');
  }, [matchinfo]);

  return (
    <div className='container'>
      <div className='bg-primary text-white p-3 mb-3 rounded-pill shadow-lg'>
        <h1>{matchinfo.seriesName} – {matchinfo.matchDesc}</h1>
        <h2>{matchinfo.status}</h2>
      </div>

      <div className='bg-success text-white p-3 mb-3 rounded-pill shadow-lg'>
        <h2>{team1}</h2>
        {matchscore1 ? (
          Object.values(matchscore1).map((item, index) => (
            <h4 key={index}>
              Innings: {item.inningsId} | Runs: {item.runs}, Wickets: {item.wickets}, Overs: {item.overs}
            </h4>
          ))
        ) : (
          <h4>{team1} – Match has not started yet.</h4>
        )}
      </div>

      <div className='bg-success text-white p-3 rounded-pill shadow-lg'>
        <h2>{team2}</h2>
        {matchscore2 ? (
          Object.values(matchscore2).map((item, index) => (
            <h4 key={index}>
              Innings: {item.inningsId} | Runs: {item.runs}, Wickets: {item.wickets}, Overs: {item.overs}
            </h4>
          ))
        ) : (
          <h4>{team2} – Match has not started yet.</h4>
        )}
      </div>
    </div>
  );
};

export default IScorecard;
