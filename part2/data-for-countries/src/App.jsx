import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'

const FilteredResults = ({ results }) => {

  if (results.length > 10) return "Too many matches, please specify another filter."
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
    return countries.
      filter((country) => {
        if (country.name.common.toLowerCase().indexOf(searchFilter) > -1) return true;
      })
      .map(country => country.name.common);
  }

  return (
    <>
      <div>
        find country:<input type="text" id="countryInput" onChange={handleInput} />
      </div>
      {
        searchFilter.length > 0 ? <FilteredResults results={filterResults()} />
          :
          ""
      }
    </>
  )
}

export default App
