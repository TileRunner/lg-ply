import './App.css'
import {useState, useEffect} from 'react';
import { callGetLeagueData } from './callApi';
import PlayerLogin from './components/player/playerLogin';
import PlayerPages from './components/player/playerPages';
/* The following line can be included in your src/index.js or App.js file
, but it does not seem to be needed after adding the stylesheet link in index.html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossorigin="anonymous"
/>
*/
//import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [leagueData, setLeagueData] = useState({"leagues":[],"players":[],"games":[]});
  const [loggedInPlayer, setLoggedInPlayer] = useState({id: 0});

  useEffect(() => {
    async function fetchData() {
        let jdata = await callGetLeagueData();
        setLeagueData(jdata);
      }
    fetchData();
  },[]);
  return (
    <div className='app'>
      <header>
        { leagueData.error ?
          <h1>Error Encountered: {leagueData.errorMessage}</h1>
        : loggedInPlayer.id === 0 ?
          <PlayerLogin setLoggedInPlayer={setLoggedInPlayer} leagueData={leagueData} setLeagueData={setLeagueData}/>
        :
          <PlayerPages loggedInPlayer={loggedInPlayer} setLoggedInPlayer={setLoggedInPlayer} leagueData={leagueData} setLeagueData={setLeagueData}/>
        }
      </header>
    </div>
  )
}

export default App
