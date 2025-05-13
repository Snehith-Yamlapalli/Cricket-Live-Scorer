import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();

  const [hostteam, sethostteam] = useState('');
  const [overs, setovers] = useState('');
  const [visitteam, setvisitteam] = useState('');
  const [tossWinner, setTossWinner] = useState('');

  function Startmatch() {
    if (!hostteam || !visitteam || !overs || !tossWinner) {
      alert('Please fill all fields and select toss winner');
      return;
    }

    const parsedOver = parseInt(overs, 10);
    if (parsedOver > 10) {
      alert('Number of overs must be less than 10');
      return;
    }

    navigate('/BBL', {
      state: { hostteam, visitteam, overs: parsedOver, toss: tossWinner }
    });
  }

  return (
    <div>
      <h1 id="head">Cric App</h1>
      <div className='row justify-content-center'>
        <div className='shadow-lg p-3 mb-5 bg-white rounded col-md-6'>
          <h1>Teams</h1>
          <input  type="text" placeholder='Host Team' className='form-control mb-2'  value={hostteam}  onChange={(e) => sethostteam(e.target.value)} />
          <input  type="text" placeholder='Visiting Team' className='form-control mb-3'  value={visitteam}  onChange={(e) => setvisitteam(e.target.value)} />

          <h2>Toss Winner</h2>
          <div className="mb-3">
            <div className="form-check">
              <input type="radio" className="form-check-input" id="hostToss" name="toss" value={hostteam} checked={tossWinner === hostteam} onChange={(e) => setTossWinner(e.target.value)} disabled={!hostteam}/>
              <label className="form-check-label" htmlFor="hostToss">
                {hostteam || "Host Team"}
              </label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="visitToss" name="toss" value={visitteam} checked={tossWinner === visitteam} onChange={(e) => setTossWinner(e.target.value)} disabled={!visitteam}/>
              <label className="form-check-label" htmlFor="visitToss">
                {visitteam || "Visiting Team"}
              </label>
            </div>
          </div>

          <h2>Overs</h2>
          <div className="row justify-content-center">
            <div className="col-md-2">
              <input  type="number"  placeholder='10'  className='form-control'  value={overs}  onChange={(e) => setovers(e.target.value)}  min="1" max="9" step="1"/>
            </div>
          </div>

          <div className="mt-4">
            <input  onClick={Startmatch}  type="button"  className='btn btn-primary btn-lg'  value='Start Match'  disabled={!hostteam || !visitteam || !overs || !tossWinner}/>
          </div>
        </div>
      </div>
    </div>
  )
}