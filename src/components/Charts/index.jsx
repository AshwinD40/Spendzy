import React from 'react'
import './style.css'
import { Line, Pie } from '@ant-design/charts';

function Charts({sortedTransactions}) {
 
  const data = sortedTransactions.map((item) => {
    return {
      date: item.date,
      amount: item.amount,
    };
  })

  const spendingData = sortedTransactions.filter(
    (transaction) => transaction.type === "expense"
  );

  // Group by tag and sum amount
  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount }; // ✅ use `value`
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});




  const config = {
    data:data,
    xField: 'date',
    yField: 'amount',
    smooth: true,
    autoFit: true,
    height: 300,
    xAxis: {
      title: { text: 'Date' },
      label: { rotate: -45 },
    },
    yAxis: {
      title: { text: 'Amount (₹)' },
      nice: true,
    },
    point: { size: 5, shape: 'circle' },
    lineStyle: { lineWidth: 2 },
  };

  const spendingConfig = {
    data: Object.values(finalSpendings),
    angleField: 'amount',
    colorField: 'tag',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    height: 300,
  };


  let chart;
  let pieChart;

  return (
    <>
      <div className="charts-wrapper">
        <div className='line-chart'>
          <h2 style={{ margin: 0 }}>Your Analytics</h2>
          <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>
        <div className='pie-chart'>
          <h2 style={{ margin: 0 }}>Your Spendings</h2>
          <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
        </div>
      </div>
      <div className="charts-unavailable-message">
        Charts are hidden on mobile devices for better user experience.
      </div>
    </>
    
        
  )
}

export default Charts