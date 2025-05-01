import { React, useState } from 'react'
import firebase from './firebase'
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Teams() {
  const realtimefirebasedb = firebase.database()
  const [allteams, setallteams] = useState([])
  const [teamname1, setteamname1] = useState()
  const [teamname2, setteamname2] = useState()
  const [newplayer1, setnewplayer1] = useState('')
  const [newplayer2, setnewplayer2] = useState('')
  const [playerlist1, setplayerslist1] = useState([])
  const [playerlist2, setplayerslist2] = useState([])

  function addplayer1() {
    setplayerslist1([...playerlist1, newplayer1])
    setnewplayer1('')
  }
  function addplayer2() {
    setplayerslist2([...playerlist2, newplayer2])
    setnewplayer1('')
  }

  const deletePlayer = (teamNum, idx) => {
    if (teamNum === 1) {
      const copy = [...playerlist1]; copy.splice(idx, 1)
      setplayerslist1(copy)
    }
    if (teamNum === 2) {
      const copy = [...playerlist2]; copy.splice(idx, 1)
      setplayerslist2(copy)
    }
  }
  var duplicate = [...allteams]

  function savedata1() {
    var TeamData =
    {
      dbplayerslist: playerlist1,
      dbteamname: teamname1
    }
    duplicate.push(teamname1)

    realtimefirebasedb.ref(teamname1).set(TeamData).then(() => {
      setallteams(prev => [...prev, teamname1])
      alert('Team saved successfully!');
      setnewplayer1('');
      setplayerslist1([]);
    }).catch(err => { console.error(err); alert('Error saving team: ' + err.message); });
  }
  function savedata2() {
    var TeamData =
    {
      dbplayerslist: playerlist2,
      dbteamname: teamname2
    }
    duplicate.push(teamname2)

    realtimefirebasedb.ref(teamname2).set(TeamData).then(() => {
      setallteams(prev => [...prev, teamname2])
      alert('Team saved successfully!');
      setnewplayer2('');
      setplayerslist2([]);
    }).catch(err => { console.error(err); alert('Error saving team: ' + err.message); });
  }

  function TeamsDone() {

    const newTeam1 = teamname1.trim();
    const newTeam2 = teamname2.trim();


    realtimefirebasedb.ref('DBteams').once('value')
      .then(snapshot => {
        const existingTeams = snapshot.val() || [];
        const updatedTeams = [...existingTeams, newTeam1, newTeam2];
        return realtimefirebasedb.ref('DBteams').set(updatedTeams)
          .then(() => updatedTeams);
      })
      .then(updatedList => {
        setallteams(updatedList);
        setteamname1('');
        setteamname2('');
        setnewplayer1('');
        setnewplayer2('');
        setplayerslist1([]);
        setplayerslist2([]);
        alert('Team added to DBteams successfully!');
      })
      .catch(err => {
        console.error(err);
        alert('Error writing DBteams: ' + err.message);
      });
  }


  const playerstable1 = playerlist1.map((object, index) => {
    return <div className='row justify-content-center'>

      <h5 className='col-md-6 text-left'>{object}</h5>
      {/* <button onClick={() => { deletetask1(index) }} className='col-md-1 btn btn-danger' id='danger'>Delete</button> */}
    </div>

  })
  const playerstable2 = playerlist2.map((object, index) => {
    return <div className='row justify-content-center'>

      <h5 className='col-md-6 text-right'>{object}</h5>
      {/* <button onClick={() => { deletetask2(index) }} className='col-md-1 btn btn-danger' id='danger'>Delete</button> */}
    </div>

  })
  return (
    <div>
      <div className="row justify-content-center ">
        <div className='col-md-2' id='inp'>
          <input type="text" id='team1' className='form-control col-md-2' placeholder='Team Name'
            value={teamname1} onChange={(e) => { setteamname1(e.target.value) }} />
          <input type="text" id='players1' placeholder='Players' className='form-control col-md-4'
            value={newplayer1} onChange={(e) => { setnewplayer1(e.target.value) }} />
        </div>
        <button onClick={addplayer1} className='btn btn-success col-md-1' id='addbutton1'>ADD</button>
        <div id='table1' className='col-md-2'>
          <ul className="list-group">
            {playerlist1.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                {p}
                <button className="btn btn-sm btn-danger" onClick={() => deletePlayer(1, i)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* /-------------------------------------------/ */}


      <div className="row justify-content-center ">
        <div className='col-md-2' id='inp'>
          <input type="text" id='team2' className='form-control col-md-2' placeholder='Team Name'
            value={teamname2} onChange={(e) => { setteamname2(e.target.value) }} />
          <input type="text" id='players2' placeholder='Players' className='form-control col-md-4'
            value={newplayer2} onChange={(e) => { setnewplayer2(e.target.value) }} />
        </div>
        <button onClick={addplayer2} className='btn btn-success col-md-1' id='addbutton2'>ADD</button>
        <div id='table2' className='col-md-2'>
          <ul className="list-group">
            {playerlist2.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                {p}
                <button className="btn btn-sm btn-danger" onClick={() => deletePlayer(1, i)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <br /><br /><br />
      <button onClick={savedata1} className='btn btn-success col-md-1' id='save1'>SAVE</button>
      <button onClick={savedata2} className='btn btn-success col-md-1' id='save2'>SAVE</button>
      <button onClick={TeamsDone} className='btn btn-success col-md-1' id='done'>Done</button>
    </div>
  )
}
