import { useState, useEffect } from 'react'
import isEqual from 'lodash';
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx';
import Persons from './components/Persons.jsx'
import phoneBookService from './services/phoneBookService.jsx';
import Notification from './components/Notification.jsx'

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [changeMessage, setChangeMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const addToPhonebook = (event) => {
    event.preventDefault()
    console.log('something deadedaaede')
    const msg = `${newName} is already in the phonebook, change the number?`
    const duplicatePerson = persons.find(item => item.name === newName)

    console.log('duplicate', duplicatePerson)
    if (duplicatePerson) {
      const newPersonObject = {
        name: newName,
        number: newNumber,
        id: duplicatePerson.id
    }
      if (window.confirm(msg)) {
        phoneBookService
          .update(String(duplicatePerson.id), newPersonObject)
          .then(response => {
            setPersons(persons.map(p => p.id !== duplicatePerson.id ? p : response))
            setNewName('')
            setNewNumber('')
            setIsError(false)
            setChangeMessage('User is updated')
            setTimeout(() => {
              setChangeMessage(null)
                }, 5000)
          })
          .catch(error => {
            console.log(error)
            setIsError(true)
            setChangeMessage(error.response.data.error)
            setTimeout(() => {
              setChangeMessage(null)
                }, 5000)
          })
      }
    } else {
    const newObject = {name: newName, number: newNumber}
    phoneBookService
      .create(newObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setChangeMessage('User is added')
        setTimeout(() => {
          setChangeMessage(null)
            }, 5000)
      })
      .catch(error => {
        console.log(error)
        setIsError(true)
        setChangeMessage(error.response.data.error)
        setTimeout(() => { 
          setChangeMessage(null)
            }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)

  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterPhoneBook = (event) => {
    const filterValue = event.target.value;
    setNewFilter(event.target.value)
    if (newFilter !== '') {
      setPersons(persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase())))
    }
    else {
      console.log(response)
      phoneBookService
        .getAll()
        .then(response => {
          setPersons(response)
        })
    }
  }

  useEffect(() => {
    console.log('useEffect')
    phoneBookService
      .getAll()
      .then(response => {
        console.log(response)
        setPersons(response)
      })
  }, [])

  const handleDeletePerson = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    const id = event.target.value
    phoneBookService
      .deletePerson(id)
      .then(response => {
        console.log('delete', response)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.error('Error deleting person:', error);
        console.log(error)
        setIsError(true)
        setChangeMessage(error.response.data.error)
        setTimeout(() => {
          setChangeMessage(null)
            }, 5000)
      });
  }

  return (
    <div>
      <div>
      <Notification message={changeMessage} error={isError}/>
        <h1>Phonebook</h1>
        <Filter newFilter={newFilter} filterPhoneBook={filterPhoneBook}/>
        
      </div>
      
      <h2>Phonebook</h2>
      <PersonForm 
        addToPhonebook={addToPhonebook}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} handleDeletePerson={handleDeletePerson}/>
      
    </div>
  )
}

export default App