import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'

const FilteredResults = ({ results, showClickHandler }) => {

  if (results.length > 10) return "Too many matches, please specify another filter.";
  else {
    return results.map((country, index) => {
      return (
        <div key={country}>
          {country} &nbsp; {results.length > 1 && <button onClick={() => { showClickHandler(country.toLowerCase()) }}>show</button>}
          {/* {index !== results.length - 1 && <br />}{" "} */}
        </div>)
    })
  }
}

const CountryInfo = ({ data }) => {
  return (
    <>
      <div>
        <h1>{data.name.common}</h1>
      </div>
      <div>
        Capital: {data.capital}
      </div>
      <div>
        Area: {data.area}
      </div>
      <div>
        Languages: <ul>  {Object.keys(data.languages).map(language => (
          <li key={language}>{data.languages[language]}</li>
        ))}</ul>
      </div>
      <div>
        <img src={data.flags.png} />
      </div>
    </>
  )
}

const WeahterInfo = ({ data }) => {
  return (
    <>
      <div>
        <h1>Weather in {data.location.name}</h1>
      </div>
      <div>
        Temperature (c): {data.current.temp_c}
      </div>
      <div>
        <img src={data.current.condition.icon} />
      </div>
      <div>
        Wind (kph): {data.current.wind_kph}
      </div>

    </>
  )
}

function App() {

  const [countries, setCountries] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [lastFetchedCountry, setLastFetchedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      })
  }, [])

  const fetchAndSetCountryData = (country) => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setCountryData(response.data);
        setLastFetchedCountry(country);
      })
  }

  const fetchWeatherData = (country) => {
    axios.get(`http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${country}&aqi=no`)
      .then(response => {
        setWeatherData(response.data);
      })
  }

  const buttonClickHandler = (country) => {
    fetchAndSetCountryData(country);
    fetchWeatherData(country);
  }

  const handleInput = (event) => {
    const searchString = event.target.value.toLowerCase();
    if (searchString.length > 0) {
      const processedCountries =
        countries.
          filter((country) => {
            if (country.name.common.toLowerCase().indexOf(searchString) > -1) return true;
          })
          .map(country => country.name.common);
      if (processedCountries.length === 1) {
        if (processedCountries[0] !== lastFetchedCountry) {
          fetchAndSetCountryData(processedCountries[0]);
          fetchWeatherData(processedCountries[0])
        }
      }
      else {
        setCountryData(null);
        setLastFetchedCountry(null);
        setWeatherData(null);
      }
      setFilteredCountries(processedCountries);
    }
    else {
      setCountryData(null);
      setLastFetchedCountry(null);
      setFilteredCountries(null);
      setWeatherData(null);
    }
  }

  return (
    <>
      <div>
        find country:<input type="text" id="countryInput" onChange={handleInput} />
      </div>
      <div>
        <br />
      </div>
      <div>
        {filteredCountries &&
          <FilteredResults results={filteredCountries} showClickHandler={buttonClickHandler} />}
        {countryData && <CountryInfo data={countryData} />}
        {weatherData && <WeahterInfo data={weatherData} />}
      </div>
    </>
  )
}

export default App
