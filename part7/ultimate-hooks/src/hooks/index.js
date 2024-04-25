import axios from 'axios'
import { useState, useEffect } from 'react'

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

export const useResource = (url) => {
    const [resources, setResources] = useState([]);
    const [baseUrl, setBaseUrl] = useState(url);

    useEffect(() => {
        axios.get(baseUrl)
            .then(response => {
                setResources(response.data);
            })
            .catch(error => {
                setResources(null);
            })
    }, [])


    const create = newObject => {
        axios.post(baseUrl, newObject)
            .then(response => {
                const newResources = [...resources];
                newResources.push(response.data);
                setResources(newResources);
                return true;
            })
            .catch(error => {
                console.log("create error: ", error);
                return false;
            })
    }

    const getAll = () => {
        axios.get(baseUrl)
            .then((resources) => {
                setResources(resources)
            })
    }

    const service = {
        create, getAll
    }

    return [
        resources, service
    ]
}
