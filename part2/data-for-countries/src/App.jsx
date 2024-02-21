import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'

const FilteredResults = ({ results }) => {

  if (results.length > 10) return "Too many matches, please specify another filter.";
  else {
    return results.map((country, index) => {
      return (
        <div key={country}>
          {country}
          {/* <button onClick={() => { deleteHandler(person.id, person.name) }}>delete</button> */}
          {/* {index !== results.length - 1 && <br />}{" "} */}
        </div>)
    })
  }
}

const CountryInfo = ({ data }) => {
  console.log("data->", data);
  return (
    <>
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

function App() {

  // const [searchFilter, setSearchFilter] = useState("");
  const [countries, setCountries] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      })
  }, [])

  const handleInput = (event) => {

    const searchString = event.target.value.toLowerCase();

    const processedCountries = countries.
      filter((country) => {
        if (country.name.common.toLowerCase().indexOf(searchString) > -1) return true;
      })
      .map(country => country.name.common);

    if (processedCountries.length === 1) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${processedCountries[0]}`)
        .then(response => {
          setCountryData(response.data);
        })
    }
    else setCountryData(null);

    setFilteredCountries(processedCountries);
  }

  // const filterResults = () => {
  //   if (countries) {
  //     const filteredCountries = countries.
  //       filter((country) => {
  //         if (country.name.common.toLowerCase().indexOf(searchFilter) > -1) return true;
  //       })
  //       .map(country => country.name.common);

  //     if (filteredCountries.length === 1) {
  //       axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`)
  //         .then(response => {
  //           setCountryData(response.data);
  //         })
  //     }
  //     return filteredCountries;
  //   }
  //   else return null;
  // }

  return (
    <>
      <div>
        find country:<input type="text" id="countryInput" onChange={handleInput} />
      </div>
      <div>
        {filteredCountries && <FilteredResults results={filteredCountries} />}
        {countryData && <CountryInfo data={countryData} />}
      </div>
    </>
  )
}

export default App
