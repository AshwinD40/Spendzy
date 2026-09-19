import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-white transition-colors duration-300 flex flex-col">
      <PublicNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
