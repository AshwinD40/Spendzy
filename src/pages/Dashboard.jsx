import React, { useEffect,useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddIncome from '../components/Modal/AddIncome'
import AddExpense from '../components/Modal/AddExpense'
import moment from 'moment'
import { addDoc, collection, getDocs,  } from 'firebase/firestore'
import { auth, db } from '../firebase'
import toast from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import TransactionTable from '../components/TransactionTable'
import Charts from '../components/Charts'
import NoTransaction from '../components/NoTransaction'

function Dashboard() {

  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [showData, setShowData] = useState(false);
  const [loadingToastId, setLoadingToastId] = useState(null);

  const [income , setIncome] = useState(0);
  const [expense , setExpense] = useState(0);
  const [totalBalance , setTotalBalance] = useState(0);

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }
  const handleIncomeCancle = () => {
    setIsIncomeModalVisible(false);
  };
  const handleExpenseCancle = () => {
    setIsExpenseModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("submitted values", values)
    const newTransaction = {
      type: type,
      date:values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    }

    addTransaction(newTransaction)
  }

  async function addTransaction(transaction, many) {
    setLoading(true);
    // Add the new transaction to the transactions array
    try {
      toast.dismiss()
      const id = toast.loading("Adding Transaction...");
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      const savedTransaction = {...transaction, id: docRef.id};
      setTransactions(prev => [...prev, savedTransaction]);
      toast.dismiss(id);
      if(!many) toast.success("Transaction Added!");
      setIsExpenseModalVisible(false);
      setIsIncomeModalVisible(false);

    } catch (error) {
      console.error("Error adding Document", error);
      if(!many) toast.error("couldn't add transaction");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions])

  function calculateBalance() {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      } else{
        expenseTotal += transaction.amount;
      }
    })

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }

  useEffect(() => {
    const fetchTransaction = async () => {
      if(loadingUser || !user?.uid) return;
      setLoading(true);

      try{
        const querySnapshot  = await getDocs(
          collection(db, `users/${user.uid}/transactions`)
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
      } catch(error){
        console.log("Error fetching Transactions", error);
        toast.error("Failed to load Transactions");
      } finally{
        setLoading(false);
      }
    };
    fetchTransaction();
    
  },[user, loadingUser]);

  useEffect(() => {
    if(loading){
      const id = toast.loading("Loading...");
      setLoadingToastId(id);
      setShowData(false);
    } else {
      if(loadingToastId){
        toast.dismiss(loadingToastId);
      }

      const timeout = setTimeout(() => {
        setShowData(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading])  

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });


  return (
     
    <div className='deshboard'>
      <Header/>
      { loading || !showData
        ? null
        : (<>
          <Cards 
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancle={handleExpenseCancle}
            onFinish={onFinish}  
          />

          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancle={handleIncomeCancle}
            onFinish={onFinish}  
          />
          {transactions.length != 0 ? (<Charts sortedTransactions={sortedTransactions}/>)  : (< NoTransaction />) }
          
          
          <TransactionTable 
            transactions={transactions} 
            addTransaction={addTransaction} 
          />
        </>)
      } 
    </div> 
        
  )
}

export default Dashboard