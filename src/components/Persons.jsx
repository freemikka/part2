import React from 'react'

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <>
    {persons.map(person => 
    <div key={person.name}>
        <p> {person.name} {person.number} <button type='submit' onClick={handleDeletePerson} value={person.id}>Delete</button> </p> 
    </div>
        )
    }
    
    </>
  )
}

export default Persons