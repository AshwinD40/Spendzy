import React, { useEffect,useState } from 'react'
import Cards from '../components/Common/Cards'
import Footer from '../components/Common/Footer'
import AddIncome from '../components/Modal/AddIncome'
import AddExpense from '../components/Modal/AddExpense'
import { addDoc, collection, getDocs,  } from 'firebase/firestore'
import { auth, db } from '../firebase'
import toast from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import TransactionTable from '../components/TransactionTable'
import Charts from '../components/Charts';
import NoTransaction from '../components/Common/NoTransaction';
import Navbar from '../components/Common/Navbar';

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
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);


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
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-35%] left-[-25%] w-[520px] h-[520px] bg-blue-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-35%] right-[-25%] w-[520px] h-[520px] bg-rose-500/10 rounded-full blur-[160px]" />
      </div>
      <Navbar />
      {loading || !showData ? null : (
        <main
          className=" w-full max-w-[1120px] mx-auto space-y-6 py-20 "
        >
          {/* Cards */}
          <section className="relative p-1 sm:p-2">
            <Cards
              income={income}
              expense={expense}
              totalBalance={totalBalance}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal}
            />
          </section>

          <div className="relative my-4 sm:my-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          {/* Charts */}
          <section className="relative p-1 sm:p-2">
            {transactions.length !== 0 ? (
              <Charts sortedTransactions={sortedTransactions} />
            ) : (
              <NoTransaction />
            )}
          </section>

          <div className="relative my-4 sm:my-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          {/* Table */}
          <section className="relative ">
            <TransactionTable
              transactions={transactions}
              addTransaction={addTransaction}
            />
          </section>
          <div className="relative my-6 sm:my-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          <Footer />

          {/* Modals */}
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
        </main>
      )}
    </div>
  );
}

export default Dashboard