import { useState, useEffect } from "react";
import PhoneList from "./components/phoneList";
import PhoneForm from "./components/phoneForm";
import FilterForm from "./components/filterForm";
import personService from "./services/persons";
import Notification from "./components/information";
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newFilter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [infoMessage, setInfoMessage] = useState([])

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson && window.confirm(`${newName} is already added to the phonebook, replace the number?`)) 
    {
      existingPerson.number = newNumber
      personService
      .update(existingPerson.id, existingPerson)
      .then(persons => {
        console.log(persons)
        return personService.getAll();
      })
      .then((persons) => {
        setPersons(persons);
        updateInfoMessage(personObject.name, "Updated", "info")
      })
      .catch(error => {
        updateInfoMessage(
          "",
          `Person '${personObject.name}' was already removed from server`,
          "error"
        )
        setTimeout(() => {
          setInfoMessage([])
        }, 5000)})
      
    }
    else 
    {
      personService.create(personObject).then((persons) => {
        setPersons((prevPersons) => prevPersons.concat(persons));
      });
      updateInfoMessage(personObject.name, "Added", "info")
      setNewName("");
      setNewNumber("");
    }
  };

  const updateInfoMessage = (name, msg, level) => {
    setInfoMessage([`${msg} ${name}`, level])
    setTimeout(() => {
      setInfoMessage("")
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);

    if (event.target.value === "") {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  };

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const handleDeleteClick = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(() => {
          return personService.getAll();
        })
        .then((persons) => {
          setPersons(persons);
        });
    }
  };

  const peopleToShow = showAll
    ? persons
    : persons.filter((person) => person.name.includes(newFilter));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage[0]} info={infoMessage[1]}/>
      <FilterForm handleFilterChange={handleFilterChange} filter={newFilter} />
      <PhoneForm
        addPerson={addPerson}
        name={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <PhoneList persons={peopleToShow} onClickDelete={handleDeleteClick} />
    </div>
  );
};

export default App;
