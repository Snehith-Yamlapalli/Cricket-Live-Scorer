import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NewBatsman() {
  const location = useLocation();
  const navigate = useNavigate();
  const { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, bowlerballs, teamruns,thisover } = location.state || {};
  const [newstriker, setnewstriker] = useState()
  const [newnonstriker, setnewnonstriker] = useState()
  const newBowlerBalls = bowlerballs + 1
  const newteamruns = teamruns

  function Startmatch() {
    if (tag) {
      const stcandidate = newstriker?.trim();
      if (!newstriker?.trim()) {
        alert('Please enter the new striker name');
        return;
      }
      navigate('/scorecard', {
        state: { innings, hostteam, visitteam, overs, striker: stcandidate, nonstriker, bowler, tag: tag, bowlerballs: newBowlerBalls, teamruns: newteamruns,thisover }
      });
    }
    else {
      const nstcandidate = newnonstriker?.trim();
      if (!newnonstriker?.trim()) {
        alert('Please enter the new non-striker name');
        return;
      }
      navigate('/scorecard', {
        state: { innings, hostteam, visitteam, overs, striker, nonstriker: nstcandidate, bowler, tag: tag, bowlerballs: newBowlerBalls, teamruns ,thisover
        }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
          <div><h1>New Batman</h1></div>
          <div><h3>{innings === 1 ? hostteam : visitteam}</h3></div>
        </div>
        <input type="text" className="form-control" placeholder="Striker name" value={tag ? newstriker : (striker || '')} readOnly={!tag} required={tag} onChange={(e) => setnewstriker(e.target.value)} />
        <input type="text" className="form-control" placeholder="Non-striker name" value={tag ? (nonstriker || '') : newnonstriker} readOnly={tag} required={!tag} onChange={(e) => setnewnonstriker(e.target.value)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
          <div><h1>Bowler</h1></div>
          <div><h3>{innings === 2 ? hostteam : visitteam}</h3></div>
        </div>
        <input type="text" className='form-control' placeholder='Bowler name' value={bowler || ''} readOnly />
        <input type="button" className="btn btn-primary" value="Done" onClick={Startmatch} />
      </div>
    </div>
  );
}

