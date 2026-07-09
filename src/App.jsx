import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Customers from "./pages/Customers";
import Pricing from "./pages/Pricing";
import MainAppLayout from "./Layout/MainAppLayout";
import OverviewView from "./pages/Views/OverviewView";
import TransactionsView from "./pages/Views/TransactionsView";
import BudgetsView from "./pages/Views/BudgetsView";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

import { Toaster } from "react-hot-toast";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null; 
  }

  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        <Routes>
          {/* Standalone Auth Screen */}
          <Route path="/signup" element={user ? <Navigate to="/app" replace /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Signup />} />

          <Route element={<MainAppLayout />}>
            {/* Home View */}
            <Route path="/" element={user ? <Navigate to="/app" replace /> : <Home />} />

            {/* Showcase / Catalog Views */}
            <Route path="/features" element={<Features />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Authenticated Dashboard Views */}
            <Route path="/app">
              <Route index element={user ? <OverviewView /> : <Navigate to="/" replace />} />
              <Route path="transactions" element={user ? <TransactionsView /> : <Navigate to="/" replace />} />
              <Route path="budgets" element={user ? <BudgetsView /> : <Navigate to="/" replace />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


