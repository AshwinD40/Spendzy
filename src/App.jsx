import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MainAppLayout from "./Layout/MainAppLayout";
import PublicLayout from "./Layout/PublicLayout";
import OverviewView from "./pages/Views/OverviewView";
import TransactionsView from "./pages/Views/TransactionsView";
import BudgetsView from "./pages/Views/BudgetsView";
import SettingsView from "./pages/Views/SettingsView";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Analytics />

      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/signup" element={user ? <Navigate to="/app" replace /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Signup />} />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <MainAppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<OverviewView />} />
            <Route path="transactions" element={<TransactionsView />} />
            <Route path="budgets" element={<BudgetsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
