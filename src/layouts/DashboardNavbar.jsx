/* layouts/DashboardNavbar.jsx: application source file. See README.md for the folder responsibility. */
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/auth";
import { ROUTES } from "../constants/routes";
/** Top bar for the authenticated area, including logout. */
export default function DashboardNavbar(){const navigate=useNavigate();const logout=()=>{clearAuthSession();navigate(ROUTES.LOGIN,{replace:true});};return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl"><div className="flex h-20 items-center justify-between px-5 sm:px-6 lg:px-8"><div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Metalan Wealth</p><p className="mt-1 text-sm font-semibold">Private Dashboard</p></div><div className="flex items-center gap-2"><button className="rounded-xl p-3 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19}/></button><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"><LogOut size={17}/>Logout</button></div></div></header>}
