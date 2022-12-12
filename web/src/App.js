import './App.css';
import axios from 'axios';
import { useState } from 'react'

let baseUrl = '';
if (window.location.href.split[0] === 'http') {
  baseUrl = 'http://localhost:5001';
}

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [cityName, setCityName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(cityName)
    axios.get(`${baseUrl}/weather/${cityName}`)
      .then(response => {
        console.log('response: ', response.data)
        setWeatherData(response.data);
      })
      .catch(err => {
        console.log("error: ", err);
      })
  }

  return (
    <form onSubmit={submitHandler}>
      <input type="text" onChange={e => { setCityName(e.target.value) }} />
      <input type="submit" value='search' />
    </form>
  );
}

export default App;
