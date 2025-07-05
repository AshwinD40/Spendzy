import React from 'react'
import './style.css'

function Input({label, state , setState, placeholder, type}) {
  return (
    <div className='input-wrapper'>
      <p className='label-wrapper'>{label}</p>
      <input  
        type={type}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        className='custom-input'
      />
      
    </div>
  )
}

export default Input