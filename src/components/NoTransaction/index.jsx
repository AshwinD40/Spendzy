import React from 'react'
import transactions from "../../assets/transactions.svg"

function NoTransaction() {
  return (
    <div 
      style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        width:"100%",
        marginBottom:"2rem"
      }}
    >
      <img
        src={transactions}
        style={{width:"400px",margin:"2rem auto"}}
      />
      <p style={{textAlign:"center", fontSize:"1.2rem"}}>You Have No Transaction Yet</p>
    </div>
  )
}

export default NoTransaction