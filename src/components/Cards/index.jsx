import React from 'react'
import './style.css'
import {  Card, Row } from 'antd'
import Button from '../Button'

function formatAmount(amount) {
  if(typeof amount !== "number" || isNaN(amount)) return '0';
  return amount.toLocaleString('en-IN');
}

function Cards({showExpenseModal, showIncomeModal, income, expense, totalBalance, transactions}) {
  return (
    <div>
      <Row className='row-wrapper'>
        <Card className='my-card total-card'  >
          <h2>Current Balance</h2>
          <p>₹<span>{formatAmount(totalBalance)}</span></p> 
          <Button text="Reset Balance" /> 
        </Card>
        <Card className='my-card income-card'  >
          <h2>Your Income</h2>
          <p>₹<span>{formatAmount(income)}</span></p> 
          <Button text=" Add Income" onClick={showIncomeModal}/> 
        </Card>
        <Card className='my-card expense-card'  >
          <h2>Your Expenses</h2>
          <p>₹<span>{formatAmount(expense)}</span></p> 
          <Button text="Add Expense" onClick={showExpenseModal}/> 
        </Card>
      </Row>

    </div>
  )
}

export default Cards