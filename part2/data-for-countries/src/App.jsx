import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'



function App() {

  const [searchFilter, setSearchFilter] = useState("");
  const [countries, setCountries] = useState("");

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      })
  }, [])

  const handleInput = (event) => {
    const inputValue = event.target.value;
    setSearchFilter(inputValue.toLowerCase());
  }

  const filterResults = () => {
    const filteredResults =
      countries.
        filter((country) => {
          if (country.name.common.toLowerCase().indexOf(searchFilter) > -1) return true;
        })
        .map(country => country.name.common);

    if (filteredResults.length > 10) return "Too many matches, please specify another filter."
    else {
      return filteredResults
        // .map((country, index) => (
        //   <div key={country.name}>
        //     {country.name}
        //     {/* <button onClick={() => { deleteHandler(person.id, person.name) }}>delete</button> */}
        //     {index !== filteredResults.length - 1 && <br />}{" "}
        //   </div>
        // ))
    }
  }
  return (
    <>
      <div>
        find country:<input type="text" id="countryInput" onChange={handleInput} />
      </div>
      {
        searchFilter.length > 0 ? filterResults()
          :
          ""
      }
    </>
  )
}

export default App
