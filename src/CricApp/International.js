import React, { useEffect, useState } from 'react'
// import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const International = () => {

   const navigate = useNavigate();

  const [livedata, setlivedata] = useState([])
  const [recentdata, setrecentdata] = useState([])
  const [upcomingdata, setupcomingdata] = useState([])
  const [liveinfo,setliveinfo] = useState()

  function Card({ item }) 
  {
    if (!item) return null;

    const match = item.matches?.[0];
    const pagematchinfo = match?.matchInfo;
    function display() 
    {
      navigate('/IScorecard', { state: match }); 
    }
    return (
      <div className="card mb-4 ms-4 mt-2 shadow" style={{ width: '250px', cursor: 'pointer' }} onClick={display} >
        <div className="card-body">
          <h5 className="card-title">{item.seriesName}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            {pagematchinfo?.matchDesc || 'N/A'}
          </h6>
          <p className="card-text">
            {pagematchinfo?.status || 'Unknown venue'}
          </p>
        </div>
      </div>
    );
  }



  async function getLivedata() {
    const url = 'https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/live';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '12f79f0ae4mshf6daccddc765c5fp137952jsn19f5e5e91ed4',
        'x-rapidapi-host': 'cricbuzz-cricket2.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const rows = result.typeMatches.find(
        (item) => {
          return item.matchType === 'International'
        })
      if(!rows){
        setlivedata([])
        setliveinfo('"No international matches going on right now"')
        return;
      }  
      const newrows = rows.seriesMatches.map(item => {
        return item.seriesAdWrapper
      });
      setlivedata(newrows)
      // console.log('Live data',newrows[0])
    } catch (error) {
      console.error(error);
    }
  }
  async function getUpcomingdata() {
    const url = 'https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/upcoming';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '12f79f0ae4mshf6daccddc765c5fp137952jsn19f5e5e91ed4',
        'x-rapidapi-host': 'cricbuzz-cricket2.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      // console.log(result)

      const rows = result.typeMatches.find(
        (item) => {
          return item.matchType === 'International'
        })

      const newrows = rows.seriesMatches.map(item => {
        return item.seriesAdWrapper
      });
      setupcomingdata(newrows)
      // console.log('Upcomimg data',newrows)

    } catch (error) {
      console.error(error);
    }
  }
  async function getRecentdata() {
    const url = 'https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/recent';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '12f79f0ae4mshf6daccddc765c5fp137952jsn19f5e5e91ed4',
		'x-rapidapi-host': 'cricbuzz-cricket2.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
  const rows = result.typeMatches.find(
        (item) => {
          return item.matchType === 'International'
        })

      const newrows = rows.seriesMatches.map(item => {
        return item.seriesAdWrapper
      });
      setrecentdata(newrows)
	console.log(result);
} catch (error) {
	console.error(error);
}
  }

  useEffect(() => {
    getLivedata()
    getRecentdata()
    getUpcomingdata()
  }, [])


  return (
    <div>
      <div className='container bg-secondary'>
        <div className='d-flex flex-row flex-wrap justify-content-start gap-3 overflow-auto'>
          <h1>{liveinfo}</h1>
          {livedata.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      <div className='container bg-info'>
        <div className='d-flex flex-row flex-wrap justify-content-start gap-3 overflow-auto'>
          {recentdata.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      <div className='container bg-primary'>
        <div className='d-flex flex-row flex-wrap justify-content-start gap-3 overflow-auto'>
          {upcomingdata.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default International
