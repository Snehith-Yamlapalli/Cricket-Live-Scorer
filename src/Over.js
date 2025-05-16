import { useLocation } from 'react-router-dom';

export default function MatchOver() {
  const { winner } = useLocation().state || {};

  return (
    <div>
      <div id='teams1' className='row justify-content-center '></div>
      <h1>Match Over</h1>
      <h2>Winner: {winner}</h2>
    </div>
  );
}
