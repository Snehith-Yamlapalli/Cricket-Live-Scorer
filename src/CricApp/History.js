import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import { auth } from '../components/firebase';

export default function History() {
  const [matches, setMatches] = useState([]); // will hold { id, name }[]
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    // New matches are stored beneath a dedicated collection and own their data.
    const dbQuery = firebase
      .database()
      .ref('matches')
      .orderByChild('ownerId')
      .equalTo(userId);                    // only keep those equal to current uid

    const handleValue = snapshot => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([matchId, matchObj]) => {
        const name = `${matchObj.teams?.home || 'Home'} vs ${matchObj.teams?.away || 'Away'}`;
        return { id: matchId, name };
      });
      setMatches(list);
    };

    dbQuery.on('value', handleValue);
    return () => dbQuery.off('value', handleValue);
  }, [userId]);

  if (!userId) {
    return <div>Please sign in to view your match history.</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="mb-3">Your Match History</h1>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <ul className="list-group">
          {matches.map(({ id, name }) => (
            <li
              key={id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <h4>{name}</h4>
              <Link to={`/scorecard/${id}`} className="btn btn-primary">
                Resume Match
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
