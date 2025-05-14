import { useLocation } from 'react-router-dom';

export default function MatchOver() {
  const { winner } = useLocation().state || {}
  return (
    <div>
      <h1 id="head">Cric App</h1>
      <div className="row justify-content-center">
        <h1>Match Done</h1>
        <h2>Winner: {winner}</h2>
      </div>
    </div>
  );
}
