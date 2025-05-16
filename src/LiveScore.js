import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from './firebase';

export default function LiveScore() {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!matchId) return;
    const dbRef = firebase.database().ref(matchId);
    const listener = dbRef.on('value', snap => setMatchData(snap.val()));
    return () => dbRef.off('value', listener);
  }, [matchId]);

  if (!matchData) return <div>Loading live score for {matchId}…</div>;

  const { INFO = {}, Innings1 = {}, Innings2 = null, Over = {} } = matchData;

  return (
    <div className="container my-4">
      <h1 className="mb-3">Match: {INFO.MatchBetween || matchId}</h1>
      <p><strong>Toss:</strong> {INFO.TossWinner} chose to {INFO.ChooseTo}</p>
      <p><strong>Overs per side:</strong> {INFO.NoOfOvers}</p>

      <hr />

      {/* Innings 1 Summary */}
      <h2 className="mt-4">Innings 1</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Team Score</th>
            <th>Runs</th><th>Wickets</th><th>Overs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{INFO.MatchBetween.split(' vs ')[0]}</td>
            <td>{Innings1.Totalteamruns ?? 0}</td>
            <td>{Innings1.Totalteamwickets ?? 0}</td>
            <td>{Innings1.Totalteamovers ?? 0}</td>
          </tr>
        </tbody>
      </table>

      {/* Innings 1 Batsmen */}
      <h4>Batsmen</h4>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th><th>Runs</th><th>Balls</th><th>4s</th><th>6s</th>
          </tr>
        </thead>
        <tbody>
          {Innings1.batsmen && Object.entries(Innings1.batsmen).map(([name, s]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{s.runs}</td>
              <td>{s.balls}</td>
              <td>{s.fours}</td>
              <td>{s.sixes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Innings 1 Bowlers */}
      <h4>Bowlers</h4>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th><th>Overs</th><th>Runs</th><th>Wkts</th><th>Maidens</th>
          </tr>
        </thead>
        <tbody>
          {Innings1.bowlers && Object.entries(Innings1.bowlers).map(([name, s]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{s.overs}</td>
              <td>{s.runs}</td>
              <td>{s.wickets}</td>
              <td>{s.maidens}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Over-by-Over Breakdown</h4>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Over</th>
            <th>Balls</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(Over).map(([overNum, balls]) => (
            <tr key={overNum}>
              <td>{Number(overNum) + 1}</td>
              <td>
                {balls.map((b, i) => (
                  <span key={i} style={{ marginRight: '6px' }}>{b}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {Innings2 && (
        <>
          <hr />

          {/* Innings 2 Summary */}
          <h2 className="mt-4">Innings 2</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Team Score</th>
                <th>Runs</th><th>Wickets</th><th>Overs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{INFO.MatchBetween.split(' vs ')[1]}</td>
                <td>{Innings2.Totalteamruns ?? 0}</td>
                <td>{Innings2.Totalteamwickets ?? 0}</td>
                <td>{Innings2.Totalteamovers ?? 0}</td>
              </tr>
            </tbody>
          </table>

          {/* Innings 2 Batsmen */}
          <h4>Batsmen</h4>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Name</th><th>Runs</th><th>Balls</th><th>4s</th><th>6s</th>
              </tr>
            </thead>
            <tbody>
              {Innings2.batsmen && Object.entries(Innings2.batsmen).map(([name, s]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{s.runs}</td>
                  <td>{s.balls}</td>
                  <td>{s.fours}</td>
                  <td>{s.sixes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Innings 2 Bowlers */}
          <h4>Bowlers</h4>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Name</th><th>Overs</th><th>Runs</th><th>Wkts</th><th>Maidens</th>
              </tr>
            </thead>
            <tbody>
              {Innings2.bowlers && Object.entries(Innings2.bowlers).map(([name, s]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{s.overs}</td>
                  <td>{s.runs}</td>
                  <td>{s.wickets}</td>
                  <td>{s.maidens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
