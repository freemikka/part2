import React from 'react'

const Notification = ({ message, error }) => {
    if (message === null) {
        return null
      }

    const change = {
        fontStyle: 'italic',
        fontSize: 16,
        border: 'solid',
        color: error ? 'red' : 'green', // Use ternary operator to set color
      };

    return (
      <div style={change}>
        {message}
      </div>
    )
  }

export default Notification