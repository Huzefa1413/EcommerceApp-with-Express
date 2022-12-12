import './App.css';
import axios from 'axios';
import { useState } from 'react'

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') {
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
    <>
      <h1>Weather App</h1>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder='City Name' onChange={e => { setCityName(e.target.value) }} />
        <input type="submit" value='Search' />
      </form>
      {
        (weatherData.length === 0) ? null :
          <div className='weatherBox'>

            City: {weatherData?.city}
            <br />
            Temperature: {Math.round(weatherData?.temp)}
            <br />
            Humidity: {Math.round(weatherData?.humidity)}
          </div>
      }
    </>
  );
}

export default App;
