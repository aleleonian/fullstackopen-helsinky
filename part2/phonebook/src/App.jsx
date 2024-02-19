import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const findPersonByName = (name) => {
    return persons.find(person => {
      if (person.name.toLowerCase() === name.toLowerCase()) return true;
    });
  }

  const addPerson = (event) => {

    event.preventDefault();

    const person = findPersonByName(newName);

    const personIndex = persons.findIndex(person => person.name === newName);

    const newPersons = [...persons];

    const newPersonObj = { name: newName, number: newNumber };

    if (!person) {
      if (!newNumber || newNumber.length === 0) {
        alert('You must add a phone number!');
        return;
      }
      newPersons.push(newPersonObj);
      setPersons(newPersons);

      personService.create(newPersonObj)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          alert('Error saving data to server: ' + error);
        })
    }
    else {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        newPersons[personIndex].number = newNumber;
        setPersons(newPersons);
        personService.update(person.id, newPersonObj);
      }
    }
    setNewName("");
    setNewNumber("");
  };

  const setTheName = (event) => {
    const value = event.target.value;
    setNewName(value);
  };
  const setTheSearchFilter = (event) => {
    const value = event.target.value;
    setSearchFilter(value);
  };
  const setTheNumber = (event) => {
    const value = event.target.value;
    setNewNumber(value);
  };

  const deletePerson = (personId, personName) => {

    if (confirm('Do you really want to delete the contact for ' + personName + '?')) {
      const newPersons = [...persons];
      const personIndex = newPersons.findIndex(person => person.id === personId);
      newPersons.splice(personIndex, 1)
      setPersons(newPersons);
      personService.delete(personId)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          alert('Error deleting data from server: ' + error);
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchFilterHandler={setTheSearchFilter} searchFilter={searchFilter} />

      <PersonForm
        nameState={newName}
        nameStateHandler={setTheName}
        numberState={newNumber}
        numberStateHandler={setTheNumber}
        clickHandler={addPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} searchFilter={searchFilter} deleteHandler={deletePerson} />

    </div>
  );
};

export default App;

const Filter = ({ searchFilter, searchFilterHandler }) => {
  return (
    <div>
      <form>
        Filter shown with: <input value={searchFilter} onChange={searchFilterHandler} />
      </form>
    </div>
  )
}
const PersonForm = ({ nameState, nameStateHandler, numberState, numberStateHandler, clickHandler }) => {
  return (
    <form>
      <div>
        name: <input value={nameState} onChange={nameStateHandler} />
      </div>
      <div>number: <input value={numberState} onChange={numberStateHandler} /></div>
      <div>
        <button onClick={clickHandler}>add</button>
      </div>
    </form>
  )
}
const Persons = ({ persons, searchFilter, deleteHandler }) => {
  return (
    <>
      {
        persons
          .filter(person => {
            if (searchFilter === "") return true;
            else if (person.name.toLowerCase().indexOf(searchFilter) > -1) return true;
          })
          .map((person, index) => (
            <div key={person.name}>
              {person.name}:{person.number}
              <button onClick={() => { deleteHandler(person.id, person.name) }}>delete</button>
              {index !== persons.length - 1 && <br />}{" "}
            </div>
          ))
      }
    </>
  )
}