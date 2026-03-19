import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
// New SPA layout & views
import MainAppLayout from "./Layout/MainAppLayout";
import OverviewView from "./pages/Views/OverviewView";
import TransactionsView from "./pages/Views/TransactionsView";

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
          {/* Authenticated Flow */}
          {user ? (
            <Route path="/app" element={<MainAppLayout />}>
              <Route index element={<OverviewView />} />
              <Route path="transactions" element={<TransactionsView />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
          ) : null}

          {/* Unauthenticated Flow */}
          <Route 
            path="/" 
            element={ user ? <Navigate to="/app" replace /> : <Home /> } 
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
