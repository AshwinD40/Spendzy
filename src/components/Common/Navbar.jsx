import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useState } from "react";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [open, setOpen] = useState(false);

  async function logoutFunc() {
    try {
      await signOut(auth);
      localStorage.removeItem("isAuth");
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Error logging out",error);
    }
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div
        className="mx-auto max-w-[1120px] flex items-center justify-between
        px-5 py-3 rounded-full
        bg-white/10 backdrop-blur-[24px]
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        {/* Logo */}
        <button
          onClick={() => navigate( "/")}
          className="text-lg font-semibold tracking-wide text-white"
        >
          Spend<span className="text-blue-400">zy</span>
        </button>

        {/* Desktop actions */}
        {user && (
          <div className="hidden sm:flex items-center gap-4">
            {!isDashboard && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-xl
                bg-white/15 text-white text-sm font-medium
                border border-white/20 hover:bg-white/25 transition"
              >
                Dashboard
              </button>
            )}

            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full border border-white/30 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              onClick={logoutFunc}
              className="text-gray-300 hover:text-white"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {user && (
          <div className="sm:hidden relative flex gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full border border-white/30 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-9 h-9 rounded-full
              bg-white/15 flex items-center justify-center
              border border-white/20 text-white"
            >
              <FiMenu size={18} />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 w-40
                rounded-xl bg-black/80 backdrop-blur-xl
                border border-white/15 shadow-xl"
              >
                {!isDashboard && (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3
                    text-sm text-white hover:bg-white/10"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={logoutFunc}
                  className="block w-full text-left px-4 py-3
                  text-sm text-rose-300 hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        {!user && (
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 rounded-3xl
            bg-zinc-900 text-white text-sm font-medium
            hover:bg-zinc-950 transition"
          >
            Sign up
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
