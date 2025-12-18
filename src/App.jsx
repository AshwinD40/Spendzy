import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "./Layout/HomeLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null; // or a loader, but keep it simple
  }

  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        <HomeLayout>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route
              path="/auth"
              element={
                user ? <Navigate to="/dashboard" replace /> : <Signup />
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                user ? <Dashboard /> : <Navigate to="/" replace />
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HomeLayout>
      </BrowserRouter>
    </>
  );
}

export default App;
