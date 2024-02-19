import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const personDoesNotAlreadyExist = (name) => {
    return persons.find(person => {
      if (person.name.toLowerCase() === name.toLowerCase()) return true;
    });
  }

  const addPerson = (event) => {
    event.preventDefault();
    if (!personDoesNotAlreadyExist(newName)) {
      if (!newNumber || newNumber.length === 0) {
        alert('You must add a phone number!');
        return;
      }
      const newPersons = [...persons];
      newPersons.push({ name: newName, number: newNumber });
      setPersons(newPersons);
    }
    else {
      alert(`${newName} is already added to phonebook`);
    }
    setNewName("");
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

      <Persons persons={persons} searchFilter={searchFilter} />

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
const Persons = ({ persons, searchFilter }) => {
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
              {index !== persons.length - 1 && <br />}{" "}
            </div>
          ))
      }
    </>
  )
}