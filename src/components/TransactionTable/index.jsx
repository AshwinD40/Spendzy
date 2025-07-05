import { Select, Table, Radio, Tag } from 'antd';
import './style.css'
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { parse, unparse } from 'papaparse';
import toast from 'react-hot-toast';

function TransactionTable({ transactions, addTransaction }) {

  const [search , setSearch] = useState("")
  const [typeFilter , setTypeFilter] = useState("all")
  const [currentPage , setCurrentPage] = useState(1)
  const [sortKey , setSortKey] = useState("")
  const { Option } = Select;
  const pageSize = 10;

  const columns = [
    {
      title: 'No',
      render: (_, __, index) =>(currentPage - 1) * pageSize + index + 1,
      key: 'index',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render:(text) => <span className='name-cell'>{text}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span className={record.type === "income" ? 'amount-income' : 'amount-expense'}>
          {amount}
        </span>
      )
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render:(tag) => <Tag color='blue'>{tag}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (<Tag color={type === "income" ? "green" : "red"}>{type.toUpperCase()}</Tag>),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) => 
      item.name.toLowerCase().includes(search.toLowerCase()) && 
      (typeFilter === "all" || item.type.toLowerCase() === typeFilter)
  );

  let sortedTransaction = [...filteredTransactions].sort((a, b) =>{
    if(sortKey === "date"){
      return new Date(a.date) -new Date(b.date)
    } else if(sortKey === "amount"){
      return a.amount - b.amount
    } else{
      return 0
    }
  } );

  function exportCSV(){
    const csv = unparse(transactions,{
      fields: ["name", "type", "amount", "tag", "date"],
    });
    const data = new Blob([csv], {type: 'text/csv:charset=utf-8'});
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importCSV(e){
    e.preventDefault();
    try{
      parse(e.target.files[0], {
        header: true,
        complete: async function(results){
          console.log("Results>>>",results);

          for(const transaction of results.data){
            console.log("Transaction", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        }
      })
      toast.success("CSV imported successfully");
      e.taget.files = null;
    } catch(e){
      console.error(e);
      toast.error("Error importing CSV");
    }
  }

  return( 
    <div className='transaction-table'>
      <div className='filter-bar'>
        <div className='search-wrapper'>
          <BiSearch className='search-icon'/>
          <input 
            placeholder="search by name" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className='search-bar' 
          /> 
        </div>
      
        <Select 
          className='select-input'
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="all">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>

      </div>
      <div className='second-filter'>
        <h2>My Transactions</h2>
        <Radio.Group 
          className='radio-input'
          onChange={(e) => setSortKey(e.target.value)}
          value={typeFilter}
        >
          <Radio value="">
            <span className= "radio-btn">No Sort</span>
          </Radio>
          <Radio value="date">
            <span className={sortKey === 'date' ? 'radio-btn active' : 'radio-btn'}>Sort by Date</span>
          </Radio>
          <Radio value="amount">
            <span className={sortKey === 'amount' ? 'radio-btn active' : 'radio-btn'}>Sort by Amount</span>
          </Radio>
        </Radio.Group>
        <div className='export-import'>
          <button className='btn' onClick={exportCSV}>Export to CSV</button>
          <label htmlFor='file-csv'  className='btn' >Import from CSV</label>
          <input 
            onChange={importCSV}
            type='file'
            id='file-csv'
            accept='.csv'
            required
            style={{display: 'none'}}
          />
        </div>

      </div>
     

      <div className='transaction-table-wrapper'>
        <Table 
          columns={columns} 
          dataSource={sortedTransaction} 
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
          }}
          rowClassName='transaction-row'
          rowKey="id"
          scroll={{x: false}}
          size='small'
        />
      </div>
    </div>
    
    )
   
}

export default TransactionTable