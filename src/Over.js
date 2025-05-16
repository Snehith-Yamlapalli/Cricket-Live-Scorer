import { useLocation } from 'react-router-dom';
import './Matchover.css';

export default function MatchOver() {
  const { winner } = useLocation().state || {};
  
  return (
    <div className="match-over-container">
      {/* Animated background elements */}
      <div className="color-wave"></div>
      <div className="color-wave delay-1"></div>
      
      {/* Confetti elements */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`confetti color-${i % 6}`}></div>
      ))}

      <div className="result-card">
        <div className="fireworks">
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
        
        <h1 className="match-done-title">Victory Parade!</h1>
        
        <div className="trophy-container">
          <div className="trophy">🏆</div>
          <div className="trophy-glow"></div>
        </div>

        <div className="winner-section">
          <div className="winner-label">Crowned Champions</div>
          <div className="winner-name-gradient">{winner}</div>
        </div>

        <div className="celebration-text">
          {['🎉', '🥇', '🚀', '💫', '✨'].map((emoji, i) => (
            <span key={i} className="celebrate" style={{ animationDelay: `${i * 0.2}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}