import { useState, useEffect } from 'react';
import personService from './services/persons';
import './assets/App.css'

const vanishMessage = (setStateFunction, milliseconds) => {
  setTimeout(
    setStateFunction
    , milliseconds);
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then(response => {
        if (Array.isArray(response.data)) setPersons(response.data);
        else setPersons([]);
      })
  }, [])

  const findPersonByName = (name) => {
    return persons.length > 0
      ? persons.find(person => {
        if (person.name.toLowerCase() === name.toLowerCase()) return true;
      })
      : false
  }


  const addPerson = (event) => {

    event.preventDefault();

    const person = findPersonByName(newName);

    const personIndex = persons.findIndex(person => person.name === newName);

    const newPersons = [...persons];

    const newPersonObj = { name: newName, number: newNumber };

    // is this person not part of our agenda?
    if (!person) {

      if (!newName || newName.length === 0) {
        setErrorMessage('You must add a name!');
        vanishMessage(() => setErrorMessage(null), 2000);
        return;
      }

      if (!newNumber || newNumber.length === 0) {
        setErrorMessage('You must add a phone number!');
        vanishMessage(() => setErrorMessage(null), 2000);
        return;
      }

      personService.create(newPersonObj)
        .then(response => {
          //gotta update persons array to include the id of the newly created person
          newPersonObj.id = response.data.id;
          newPersons.push(newPersonObj);
          setPersons(newPersons);
          setNewName("");
          setNewNumber("");
        })
        .then(() => {
          setSuccessMessage("New person added!");
          vanishMessage(() => setSuccessMessage(null), 2000);
        })
        .catch(error => {
          setErrorMessage(error.response.data.errorMessage ? error.response.data.errorMessage : error.message);
          vanishMessage(() => setErrorMessage(null), 2000);
        })
    }
    // in case it is, shall we update the contact number?
    else {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        newPersons[personIndex].number = newNumber;
        setPersons(newPersons);
        personService.update(person.id, newPersonObj)
          .then(() => {
            setSuccessMessage("Person updated!");
            setNewName("");
            setNewNumber("");
            vanishMessage(() => setSuccessMessage(null), 2000);
          })
          .catch(error => {
            setErrorMessage(error.response.data.errorMessage ? error.response.data.errorMessage : error.message);
            vanishMessage(() => setErrorMessage(null), 2000);
          })
      }
    }
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

      personService.delete(personId)
        .then(response => {
          setSuccessMessage("Person deleted!");
          newPersons.splice(personIndex, 1)
          setPersons(newPersons);
          vanishMessage(() => setSuccessMessage(null), 2000);
          console.log(response)
        })
        .catch(error => {
          setErrorMessage('Error deleting data from server: ' + error);
          vanishMessage(() => setSuccessMessage(null), 2000);
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type="success" />

      <Notification message={errorMessage} type="error" />

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
  if (persons.length > 0) {
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
  else return "";
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}