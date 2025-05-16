import React, { useEffect, useState } from 'react';
import { useParams }        from 'react-router-dom';
import firebase              from './firebase';  // your compat import

export default function LiveScore() {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    // Use the compat API
    const dbRef = firebase.database().ref(matchId);

    const listener = dbRef.on('value', snapshot => {
      setMatchData(snapshot.val());
    });

    // cleanup
    return () => dbRef.off('value', listener);
  }, [matchId]);

  if (!matchData) return <div>Loading live score for {matchId}…</div>;

  const { INFO = {}, Innings1 = {}, Innings2 = null } = matchData;

  return (
    <div>
      <h1>Match: {INFO.MatchBetween || matchId}</h1>
      <p>Toss: {INFO.TossWinner} chose to {INFO.ChooseTo}</p>
      <p>Overs per side: {INFO.NoOfOvers}</p>

      <hr />
      <h2>Innings 1</h2>
      <p>
        Runs: {Innings1.Totalteamruns ?? 0} | Wickets: {Innings1.Totalteamwickets ?? 0} | 
        Overs: {Innings1.Totalteamovers ?? 0}
      </p>

      <h3>Batsmen</h3>
      <ul>
        {Innings1.batsmen && Object.entries(Innings1.batsmen).map(([name, stats]) => (
          <li key={name}>
            {name} — {stats.runs} ({stats.balls} balls), 4×{stats.fours}, 6×{stats.sixes}
          </li>
        ))}
      </ul>

      <h3>Bowlers</h3>
      <ul>
        {Innings1.bowlers && Object.entries(Innings1.bowlers).map(([name, stats]) => (
          <li key={name}>
            {name} — {stats.overs} overs, {stats.runs} runs, {stats.wickets} wkts, {stats.maidens} maidens
          </li>
        ))}
      </ul>

      {Innings2 && (
        <>
          <hr />
          <h2>Innings 2</h2>
          <p>
            Runs: {Innings2.Totalteamruns ?? 0} | Wickets: {Innings2.Totalteamwickets ?? 0} | 
            Overs: {Innings2.Totalteamovers ?? 0}
          </p>

          <h3>Batsmen</h3>
          <ul>
            {Innings2.batsmen && Object.entries(Innings2.batsmen).map(([name, stats]) => (
              <li key={name}>
                {name} — {stats.runs} ({stats.balls} balls), 4×{stats.fours}, 6×{stats.sixes}
              </li>
            ))}
          </ul>

          <h3>Bowlers</h3>
          <ul>
            {Innings2.bowlers && Object.entries(Innings2.bowlers).map(([name, stats]) => (
              <li key={name}>
                {name} — {stats.overs} overs, {stats.runs} runs, {stats.wickets} wkts, {stats.maidens} maidens
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
