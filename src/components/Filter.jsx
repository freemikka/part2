import React from 'react'

const Filter = ({ newFilter, filterPhoneBook }) => {
  return (
    <form>
          <div>Filter: 
          <input 
            value={newFilter}
            onChange={filterPhoneBook}
            /> 
          </div>
        
        </form>
  )
}

export default Filter