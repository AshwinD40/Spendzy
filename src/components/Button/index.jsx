import React from 'react'
import './style.css'

function Button({text, onClick, google, disabled}) {
  return (
    <div >
      <button onClick={onClick} className={ google ? " btn-google " : 'btn'} disabled={disabled}>
        {text}
      </button>
    </div>
  )
}

export default Button