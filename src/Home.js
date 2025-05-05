import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import firebase from './firebase';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const firebaserealtimedb = firebase.database()

  const [hostteam, sethostteam] = useState()
  const [over, setovers] = useState()
  const [visitteam, setvisitteam] = useState()

  function Startmatch() 
  {
    var matchdata = {
      dbhteam: hostteam,
      dbvteam: visitteam,
      dbovers: over
    }
    navigate('/BBL', {
      state: { hostteam, visitteam, over }
    });
    alert('starting match')
  }
  return (
    <div>
      <h1 id="head">Cric App</h1>
      <div className='row justify-content-center'>
        <div className='shadow-lg p-3 mb-5 bg-white rounded col-md-6'>
          <h1>Teams</h1>
          <input type="text" placeholder='Host Team' className='form-control mb-2' value={hostteam} onChange={(e) => { sethostteam(e.target.value) }} />
          <input type="text" placeholder='Visiting Team' className='form-control mb-3' value={visitteam} onChange={(e) => { setvisitteam(e.target.value) }} />

          <h2>Overs</h2>
          <div className="row justify-content-center">
            <div className="col-md-2">
              <input type="text" placeholder='10' className='form-control' value={over} onChange={(e) => { setovers(e.target.value) }} />
            </div>
          </div>

          <h2>Toss Won by</h2>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <input type="text" placeholder='Team Name' className='form-control' />
            </div>
          </div>
          <input onClick={Startmatch} type="button" className='btn btn-primary' value='Done' />
        </div>
      </div>
    </div>
  )
}
