import React from 'react'
import Persons from './Persons'
const PersonForm = ({addToPhonebook, handleNameChange, handleNumberChange, newName, newNumber}) => {
  return (
    <form onSubmit={addToPhonebook}>
        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: 
            <input
            value={newNumber}
              onChange={handleNumberChange}
            />
        
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm