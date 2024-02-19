import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    const newPersons = [...persons];
    newPersons.push({ name: newName });
    setPersons(newPersons);
  };

  const setTheName = (event) => {
    const value = event.target.value;
    if (value && value.length > 0) {
      setNewName(value);
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input id="newPerson" value={newName} onChange={setTheName} />
        </div>
        <div>
          <button onClick={addPerson}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person, index) => (
        <div key={person.name}>
          {person.name}
          {index !== persons.length - 1 && <br />}{" "}
        </div>
      ))}
    </div>
  );
};

export default App;
