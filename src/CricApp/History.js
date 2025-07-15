import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import { auth } from '../components/firebase';

export default function History() {
  const [matches, setMatches] = useState([]); // will hold { id, name }[]
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    // Query the root for all children whose Admin === current user
    const dbQuery = firebase
      .database()
      .ref()                                 // point at the root
      .orderByChild('Admin')               // look at each child’s "Admin" field
      .equalTo(userId);                    // only keep those equal to current uid

    const handleValue = snapshot => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([matchId, matchObj]) => {
        // Pull the display name out of INFO.MatchBetween if it exists
        const name = matchObj.INFO?.MatchBetween || matchId;
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
              <Link to={`/livescoreCard/${id}`} className="btn btn-primary">
                Go to ScoreCard
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
