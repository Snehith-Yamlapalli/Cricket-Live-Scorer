import React, { useEffect, useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';

export default function BBL() 
{
  const { state = {} } = useLocation();
  const { hostteam, visitteam, overs} = state;

  const [striker, setStriker] = useState('');
  const [nonstriker, setNonstriker] = useState('');
  const [bowler, setBowler] = useState('');
  const navigate = useNavigate();
  
  function Startmatch() {
    navigate('/scorecard', {
      state: { hostteam, visitteam, overs  ,striker, nonstriker, bowler }
    });
  }

  return (
    <div className="container">
      <h1 id="head">Cric App</h1>
      <div className="row">
        <div className="col-md-6 mx-auto shadow-lg p-3 mb-5 bg-white rounded">
          <h1>Batting Team</h1>
          <input type="text" placeholder="Striker" className="form-control mb-2" value={striker} onChange={e => setStriker(e.target.value)}/>
          <input type="text" placeholder="Non Striker" className="form-control mb-3" value={nonstriker} onChange={e => setNonstriker(e.target.value)}/>
          <h1>Bowler</h1>
          <input type="text" placeholder="Bowler" className="form-control mb-2" value={bowler} onChange={e => setBowler(e.target.value)}/>
          <input type="button" className="btn btn-primary" value="Done" onClick={Startmatch}/>
        </div>
      </div>
    </div>
  );
}