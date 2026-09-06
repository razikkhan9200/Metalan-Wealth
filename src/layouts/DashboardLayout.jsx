/* layouts/DashboardLayout.jsx: application source file. See README.md for the folder responsibility. */
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
/** Private application shell; child dashboard pages render through Outlet. */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <DashboardNavbar />
        <main className="p-5 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
