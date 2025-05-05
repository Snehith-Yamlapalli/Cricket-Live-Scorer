import React, { useState } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';

export default function NewBowler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { hostteam, visitteam, totalovers, striker, nonstriker, oldbowler } = location.state || {};
    const [bowler, setnewbowler] = useState('');

    function Startmatch() {
        if (!bowler.trim()) {
            alert('Please enter a bowler name!');
            return;
        }
        navigate('/scorecard', {
            state: { hostteam, visitteam, totalovers, striker, nonstriker, bowler }
        });
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
                <h1> Batsmen </h1>
                <input type="text" className='form-control' placeholder='Striker name' value={striker || ''} readOnly />
                <input type="text" className='form-control' placeholder='Non-striker name' value={nonstriker || ''} readOnly />
                <h1>New Bowler</h1>
                <input type="text" className='form-control' placeholder='Bowler name' value={bowler} onChange={(e) => setnewbowler(e.target.value)} required />
                <input type="button" className="btn btn-primary" value="Done" onClick={Startmatch} />
            </div>
        </div>
    );
}
