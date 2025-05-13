import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from './firebase';

export default function Target() {
  const navigate = useNavigate();
  const firebaserealtimedb = firebase.database()
  const location = useLocation();
  const { hostteam, visitteam, overs, striker, nonstriker, bowler, tag: incomingTag, bowlerballs: newBowlerBalls,targetruns } = location.state || {};
           
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

  const [teamruns, setteamruns] = useState(0)
  const [teamwickets, setteamwickets] = useState(0)
  const [Teamovers, setTeamovers] = useState(0)
  const [tag, settag] = useState(incomingTag ?? true)
  const [Innings, setInnings] = useState(2)
  const [val, setval] = useState()
  const [lastrun,setlastrun] = useState(0)
  


  const Key = `Innings${Innings}`
  const matchid = hostteam + 'vs' + visitteam
  function swapbatsman() {
    settag(prev => !prev)
  }
  useEffect(() => {
    if (bowlerballs === 0 || val === 'W') // if a wicket falls down
    {
      if(lastrun ===1)swapbatsman()
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
      settag(curr => !curr);
    }
  }, [bowlerballs, bowlerruns]);



  function updatescore(val) {
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
        state: { hostteam, visitteam, over: Teamovers, striker, nonstriker, bowler, tag, bowlerballs }
      })
      return
    }
    const prevBowlerBalls = bowlerballs
    const newBowlerBalls = prevBowlerBalls + 1
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
      navigate('/newbowler', {
        state: { matchid, hostteam, visitteam, overs, striker, nonstriker, bowler, tag ,newteamovers}
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
      <h1>{"Target is "}{targetruns}</h1>
    </div>
  );
}