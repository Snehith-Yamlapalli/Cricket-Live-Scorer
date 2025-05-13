import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NewBatsman() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hostteam, visitteam, overs, striker, nonstriker, bowler, tag ,bowlerballs,teamruns} = location.state || {};
  const [newstriker, setnewstriker] = useState()
  const [newnonstriker, setnewnonstriker] = useState()
  const newBowlerBalls = bowlerballs + 1
  const newteamruns = teamruns
  function Startmatch() 
  {
    const bb = bowlerballs
    const nbb = bb + 1
    if (tag) {
      if (!newstriker?.trim()) {
        alert('Please enter the new striker name');
        return;
      }
      navigate('/scorecard', {
        state: { hostteam, visitteam, overs, striker: newstriker.trim(), nonstriker, bowler ,tag:tag ,bowlerballs:newBowlerBalls,teamruns:newteamruns}
      });
    }
    else {
      if (!newnonstriker?.trim()) {
        alert('Please enter the new non-striker name');
        return;
      }
      navigate('/scorecard', {
        state: { hostteam, visitteam, overs, striker, nonstriker: newnonstriker.trim(), bowler ,tag:tag,bowlerballs:newBowlerBalls,teamruns}
      });
    }
  }

  return (
    <div className='row justify-content-center'>
      <div id='teams' className='row justify-content-center '>
        <div className='col-md-4' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="text" className="form-control" value={hostteam} readOnly placeholder="Host name" />
          <span>Vs</span>
          <input type="text" className="form-control" value={visitteam} readOnly placeholder="Visit name" />
        </div>
      </div>

      <div className="col-md-4 mt-2">
        <h1>New Batsmen </h1>
        <input type="text" className="form-control" placeholder="Striker name" value={tag ? newstriker : (striker || '')} readOnly={!tag} required={tag} onChange={(e) => setnewstriker(e.target.value)} />
        <input type="text" className="form-control" placeholder="Non-striker name" value={tag ? (nonstriker || '') : newnonstriker} readOnly={tag} required={!tag} onChange={(e) => setnewnonstriker(e.target.value)} />
        <h1>Bowler</h1>
        <input type="text" className='form-control' placeholder='Bowler name' value={bowler || ''} readOnly />
        <input type="button" className="btn btn-primary" value="Done" onClick={Startmatch} />
      </div>
    </div>
  );
}

