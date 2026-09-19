import { Link } from "react-router-dom";
import { FiLogIn, FiGrid } from "react-icons/fi";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ThemeToggle from "../components/Common/ThemeToggle";
import Logo from "../components/Common/Logo";



export default function PublicNavbar() {
  const [user] = useAuthState(auth);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors duration-300">
        <div className="w-11/12 mx-auto h-16 flex items-center justify-between">
          {/* Logo with consistent brand styling */}
          <Logo to="/" showName size="w-6 h-6" nameSize="text-lg sm:text-xl" />

          {/* Right: theme + auth actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
                {/* Dashboard button — visible on all device sizes including small screens */}
                <Link
                  to="/app"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98]"
                >
                  <FiGrid className="text-xs sm:text-sm" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <Link
                to="/signup"
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98]"
              >
                <FiLogIn className="text-sm" />
                <span>Get started</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
