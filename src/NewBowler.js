import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NewBowler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { innings, hostteam, visitteam, overs, striker, nonstriker, oldbowler, tag, newteamovers, teamruns } = location.state || {};
    const [bowler, setnewbowler] = useState('');
    useEffect(() => {

        if (newteamovers === overs && innings===1) {
            const newinnings = 2
            alert('innnigs over')
            const newteamruns = teamruns
            navigate('/BBL', {
                state: { innings: newinnings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamruns }
            })
        }else if(newteamovers === overs && innings===2)
        {
            alert('Match over!!')
            navigate('/Over')
        }
    },);

    function Startmatch() {
        if (!bowler.trim()) {
            alert('Please enter a bowler name!');
            return;
        }
        navigate('/scorecard', {
            state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag }
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
                    <div><h1>Batting Team</h1></div>
                    <div><h3>{innings === 1 ? hostteam : visitteam}</h3></div>
                </div>
                <input type="text" className='form-control' placeholder='Striker name' value={striker || ''} readOnly />
                <input type="text" className='form-control' placeholder='Non-striker name' value={nonstriker || ''} readOnly />
                <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
                    <div><h1>New Bowler</h1></div>
                    <div><h3>{innings === 2 ? hostteam : visitteam}</h3></div>
                </div>
                <input type="text" className='form-control' placeholder='Bowler name' value={bowler} onChange={(e) => setnewbowler(e.target.value)} required />
                <input type="button" className="btn btn-primary" value="Done" onClick={Startmatch} />
            </div>
        </div>
    );
}
