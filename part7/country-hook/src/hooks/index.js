import { useState, useEffect } from 'react';
import axios from 'axios';

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

export const useCountry = (name) => {
    const [country, setCountry] = useState(name);
    useEffect(() => {
        if (name != "") {
            
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
                .then(response => {
                    const countryData = {};
                    countryData.data = response.data;
                    countryData.found = true;
                    setCountry(countryData);
                })
                .catch(error => {
                    setCountry({ found: false });
                })
        }
    }, [name])

    return country
}

