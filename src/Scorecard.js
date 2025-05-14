import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from './firebase';

export default function Scorecard() {
  const navigate = useNavigate();
  const firebaserealtimedb = firebase.database()
  const location = useLocation();
  const { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: incomingTag, bowlerballs: newBowlerBalls, teamruns: newteamruns } = location.state || {};

  var [strikerruns, setstrikerruns] = useState(0)
  var [strikerballs, setstrikerballs] = useState(0)
  var [strikerfours, setstrikerfours] = useState(0)
  var [strikersixes, setstrikersixes] = useState(0)

  const [nonstrikerruns, setnonstrikerruns] = useState(0)
  const [nonstrikerballs, setnonstrikerballs] = useState(0)
  const [nonstrikerfours, setnonstrikerfours] = useState(0)
  const [nonstrikersixes, setnonstrikersixes] = useState(0)

  const [bowlerballs, setbowerballs] = useState(newBowlerBalls ?? 0)
  const [bowlerovers, setbowlerovers] = useState(0)
  const [bowlermaiden, setbowlermaiden] = useState(0)
  const [bowlerruns, setbowlerruns] = useState(0)
  const [bowlerwickets, setbowlerwickets] = useState(0)

  const [teamruns, setteamruns] = useState(newteamruns ?? 0)
  const [teamwickets, setteamwickets] = useState(0)
  const [Teamovers, setTeamovers] = useState(0)
  const [tag, settag] = useState(incomingTag ?? true)
  const [targetruns, settargetruns] = useState()
  const Key = `Innings${innings}`
  const matchid = hostteam + 'vs' + visitteam

  function swapbatsman() {
    settag(prev => !prev)
  }

  useEffect(() => 
  {
    firebaserealtimedb
      .ref(`${matchid}/${'Innings1'}/Totalteamruns`)
      .once('value')
      .then(snap => {
        const runs = snap.val() ?? 0
        settargetruns(runs)
      })
      .catch(err => console.error(err))

      if(innings===2 && teamruns>=(targetruns+1))
    {
      const winner = 'Bowling'
      alert('Match over!')
      navigate('/Over',{
        state: {matchid, winner }
      })
    }
    if(innings===2 && Teamovers===overs && teamruns<(targetruns+1))
    {
      const winner = 'Batting'
      alert('Match over!')
      navigate('/Over',{
        state: {matchid, winner }
      })
    }
  }, );


  useEffect(() => {
    firebaserealtimedb.ref(`${matchid}/${Key}/batsmen/${striker}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setstrikerruns(d.runs ?? 0)
          setstrikerballs(d.balls ?? 0)
          setstrikerfours(d.fours ?? 0)
          setstrikersixes(d.sixes ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}/batsmen/${nonstriker}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setnonstrikerruns(d.runs ?? 0)
          setnonstrikerballs(d.balls ?? 0)
          setnonstrikerfours(d.fours ?? 0)
          setnonstrikersixes(d.sixes ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}/bowlers/${bowler}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setbowlerruns(d.runs ?? 0)
          setbowlerovers(d.overs ?? 0)
          setbowlerwickets(d.wickets ?? 0)
          setbowlermaiden(d.maidens ?? 0)
          setbowerballs(d.balls ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setteamruns(d.Totalteamruns ?? 0)
          setteamwickets(d.Totalteamwickets ?? 0)
          setTeamovers(d.Totalteamovers ?? 0)
        }
      })
  },);

  function updatescore(val) {
    const prevBowlerBalls = bowlerballs
    const newBowlerBalls = prevBowlerBalls + 1

    if (val === 'W') {
      const oldbowwick = bowlerwickets
      const newbowlwick = oldbowwick + 1
      const oldteamwick = teamwickets
      const newteamwick = oldteamwick + 1
      setteamwickets(newteamwick)
      setbowlerwickets(newbowlwick)
      const wicketUpdates = {
        [`${Key}/Totalteamwickets`]: teamwickets + 1,
        [`${Key}/batsmen/${striker}/balls`]: strikerballs + (tag ? 1 : 0),
        [`${Key}/batsmen/${nonstriker}/balls`]: nonstrikerballs + (!tag ? 1 : 0),
        [`${Key}/bowlers/${bowler}`]: {
          runs: bowlerruns + 0,
          overs: bowlerovers,
          balls: bowlerballs + 1 === 6 ? 0 : bowlerballs + 1,
          wickets: bowlerwickets + 1,
          maidens: bowlermaiden
        }
      };

      firebaserealtimedb
        .ref(matchid)
        .update(wicketUpdates)
        .catch(err => console.error(err))
      navigate('/NewBatsman', {
        state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, bowlerballs, teamruns }
      })
    }

    if (val % 2 === 1) {
      settag(prev => !prev)
    }

    if (tag) {
      setstrikerruns(r => r + val)
      if (val === 4) setstrikerfours(f => f + 1)
      if (val === 6) setstrikersixes(s => s + 1)
      setstrikerballs(b => b + 1)
    } else {
      setnonstrikerruns(r => r + val)
      if (val === 4) setnonstrikerfours(f => f + 1)
      if (val === 6) setnonstrikersixes(s => s + 1)
      setnonstrikerballs(b => b + 1)
    }

    setteamruns(r => r + val)
    setteamwickets(w => w + (val === 'W' ? 1 : 0))
    const fullOvers = Math.floor(newBowlerBalls / 6)
    const nextBowlerOvers = fullOvers

    setbowerballs(newBowlerBalls)
    setbowlerovers(nextBowlerOvers)
    setbowlerruns(r => r + val)

    const updates = {
      [`${Key}/Totalteamruns`]: teamruns + (val !== 'W' ? val : 0),
      [`${Key}/Totalteamwickets`]: teamwickets + (val === 'W' ? 1 : 0),
      [`${Key}/Totalteamovers`]: Teamovers + (newBowlerBalls === 6 ? 1 : 0),
      [`${Key}/batsmen/${striker}`]: {
        runs: strikerruns + (tag ? (val !== 'W' ? val : 0) : 0),
        balls: strikerballs + (tag ? 1 : 0),
        fours: strikerfours + (tag && val === 4 ? 1 : 0),
        sixes: strikersixes + (tag && val === 6 ? 1 : 0)
      },
      [`${Key}/batsmen/${nonstriker}`]: {
        runs: nonstrikerruns + (!tag ? (val !== 'W' ? val : 0) : 0),
        balls: nonstrikerballs + (!tag ? 1 : 0),
        fours: nonstrikerfours + (!tag && val === 4 ? 1 : 0),
        sixes: nonstrikersixes + (!tag && val === 6 ? 1 : 0)
      },
      [`${Key}/bowlers/${bowler}`]: {
        runs: bowlerruns + (val !== 'W' ? val : 0),
        overs: bowlerovers + (newBowlerBalls === 6 ? 1 : 0),
        balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
        wickets: bowlerwickets,
        maidens: bowlermaiden
      }
    }
    firebaserealtimedb
      .ref(matchid)
      .update(updates)
      .catch(err => console.error(err))

    if (newBowlerBalls === 6) {
      const prevteamovers = Teamovers;
      const newteamovers = prevteamovers + 1
      setTeamovers(newteamovers)
      if (val % 2 === 0)
        navigate('/newbowler', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamovers, teamruns }
        })
      else
        navigate('/newbowler', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag, newteamovers, teamruns }
        })
    }
  }


  return (
    <div className='row justify-content-center'>
      <div id='teams1' className='row justify-content-center '>
        <div className='col-md-2' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3>{hostteam}</h3>
          <h5><span>Vs</span></h5>
          <h3>{visitteam}</h3>
        </div>
      </div>

      <div className='shadow-lg p-3 mb-3 bg-white rounded col-md-7'>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ marginRight: '30px' }}>{hostteam}</h3>
          <h3>{teamruns}</h3><h2>-</h2><h3>{teamwickets}</h3><h2>(</h2><h3>{Teamovers}</h3><h1>.</h1><h3>{bowlerballs}</h3><h2>)</h2>
          <h3 style={{ marginLeft: '150px' }}>{'Innings - '}{innings}</h3>

          {innings === 1 && (
            <h3 style={{ marginLeft: '100px' }}>CRR:&nbsp;
              {(() => {
                const ballsBowled = Teamovers * 6 + bowlerballs;
                if (ballsBowled === 0) return '0.00';
                const oversBowled = ballsBowled / 6;
                return (teamruns / oversBowled).toFixed(2);
              })()}
            </h3>
          )}
          {innings === 2 && (
            <h3 style={{ marginLeft: '100px' }}>
              target {targetruns+1}
            </h3>
          )}
        </div>

      </div>

      <div className='shadow-lg p-3 mb-3 bg-white rounded col-md-7'>
        <table className="table">
          <thead>
            <tr>
              <th>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: tag ? '#d4edda' : 'transparent', color: tag ? 'red' : 'inherit', fontWeight: 'bold' }}>
                {striker}
              </td>
              <td>{strikerruns}</td>
              <td>{strikerballs}</td>
              <td>{strikerfours}</td>
              <td>{strikersixes}</td>
              <td>{strikerballs ? ((strikerruns / strikerballs) * 100).toFixed(2) : '0.00'}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: !tag ? '#d4edda' : 'transparent', color: !tag ? 'red' : 'inherit', fontWeight: !tag ? 'bold' : '' }}>
                {nonstriker}</td>
              <td>{nonstrikerruns}</td>
              <td>{nonstrikerballs}</td>
              <td>{nonstrikerfours}</td>
              <td>{nonstrikersixes}</td>
              <td>{nonstrikerballs ? ((nonstrikerruns / nonstrikerballs) * 100).toFixed(2) : '0.00'}</td>
            </tr>
          </tbody>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bowler}</td>
              <td>{bowlerovers}{'.'}{bowlerballs}</td>
              <td>{bowlermaiden}</td>
              <td>{bowlerruns}</td>
              <td>{bowlerwickets}</td>
              <td>{(bowlerovers * 6 + bowlerovers) ? (bowlerruns / ((bowlerovers * 6 + bowlerballs) / 6)).toFixed(2) : '0.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='shadow-lg p-3 mb-3 bg-white rounded col-md-7'>
        <h5>This Over</h5>
      </div>
      <div className='shadow-lg p-3 mb-3 bg-white rounded col-md-7'>
        <input type="button" className="btn btn-primary me-2" value="0" onClick={() => updatescore(0)} />
        <input type="button" className="btn btn-primary me-2" value="1" onClick={() => updatescore(1)} />
        <input type="button" className="btn btn-primary me-2" value="2" onClick={() => updatescore(2)} />
        <input type="button" className="btn btn-primary me-2" value="3" onClick={() => updatescore(3)} />
        <input type="button" className="btn btn-primary me-2" value="4" onClick={() => updatescore(4)} />
        <input type="button" className="btn btn-primary me-2" value="6" onClick={() => updatescore(6)} />
        <input type="button" className='btn btn-primary me-2' value="SwapBatsman" onClick={() => swapbatsman()} /> <br />
        <input type="button" className="btn btn-primary me-2" value="W" onClick={() => updatescore('W')} />
        <input type="button" className='btn btn-primary me-2' value="Wide" onClick={() => swapbatsman()} />
        <input type="button" className='btn btn-primary me-2' value="No-Ball" onClick={() => swapbatsman()} />
        <input type="button" className='btn btn-primary me-2' value="Byes" onClick={() => swapbatsman()} />
        <input type="button" className='btn btn-primary me-2' value="Leg Byes" onClick={() => swapbatsman()} />



      </div>
    </div>
  );
}