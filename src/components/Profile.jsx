import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {

  const [userDetails, setUserDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isBase = location.pathname === '/Base';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };
  function goHome() {
    navigate('/');
  }


  return (
    <div>
      {userDetails ? (
        <div className="app-header">
          <div className="container">
          <div className="row py-3 align-items-center justify-content-between">

            <div className="col-6 col-md-auto">
              <div className="app-eyebrow">CRICKET LIVE SCORER</div>
              <p className="mb-0 app-user">Signed in as {userDetails.email}</p>
            </div>

            <div className="col-12 col-md-auto text-center mt-3 mt-md-0">
              <h1 className="mb-0 app-brand">Cric<span>App</span></h1>
            </div>
            <div className="col-12 col-md-auto text-end mt-3 mt-md-0">
              {isBase
                ? <button className="btn app-nav-button" onClick={logout}>
                  Logout
                </button>
                : <button className="btn app-nav-button" onClick={goHome}>
                  Home
                </button>
              }
            </div>
          </div></div>
        </div>

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
