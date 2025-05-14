import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import firebase from './firebase';

export default function MatchOver() {
  const firebaserealtimedb = firebase.database();
  const { matchid, winner } = useLocation().state || {};

  const [info, setInfo]  = useState(null);
  const [displayWinner, setDisplayWinner] = useState('');

  useEffect(() => {
    if (!matchid) return;

    firebaserealtimedb
      .ref(`${matchid}/INFO`)
      .once('value')
      .then(snap => {
        const data = snap.val() || {};
        setInfo(data);

        // decide who actually “won”
        if (data.ChooseTo === winner) {
          setDisplayWinner(data.TossWinner);
        } else {
          setDisplayWinner(data.TossLooser);
        }
      })
      .catch(err => {
        console.error('Error fetching INFO:', err);
      });
  }, [matchid, winner, firebaserealtimedb]);

  if (!info) {
    return (
      <div>
        <h1 id="head">Cric App</h1>
        <div className="row justify-content-center">
          <h2>Loading match result…</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 id="head">Cric App</h1>
      <div className="row justify-content-center">
        <h1>Match Done</h1>
        <h2>Winner: {displayWinner}</h2>
      </div>
    </div>
  );
}
