import React from 'react'
import './style.css'
import { Line } from '@ant-design/charts';

function Charts({sortedTransactions}) {
 
  const data = sortedTransactions.map((item) => {
    return {
      date:item.date,
      amount:item.amount
    }
  })

  const config = {
    data,
    xField: 'date',
    yField: 'amount',
    autoFit: false,
    width: 800,
    height: 400,
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    lineStyle: {
      stroke: '#5B8FF9',
      lineWidth: 2,
    },
    
  };

  let chart;

  return (
    <div className='charts-wrapper'>
      <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
    </div>
  )
}

export default Charts