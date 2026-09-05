/* layouts/Sidebar.jsx: application source file. See README.md for the folder responsibility. */
import { NavLink } from "react-router-dom";
import { ArrowLeftRight, BarChart3, Building2, LayoutDashboard, Wallet, ReceiptText, UserRound } from "lucide-react";
import { dashboardNavigation } from "../constants/navigation";
const icons={Dashboard:LayoutDashboard,Properties:Building2,Funds:BarChart3,Exchange:ArrowLeftRight,Wallet,Transactions:ReceiptText,Profile:UserRound};
/** Private dashboard navigation. */
export default function Sidebar(){return <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block"><div className="border-b border-slate-200 px-7 py-6"><div className="text-xl font-bold">Metalan <span className="text-slate-400">Wealth</span></div><p className="mt-1 text-xs text-slate-400">Private wealth portal</p></div><nav className="space-y-1 p-4">{dashboardNavigation.map(item=>{const Icon=icons[item.label];return <NavLink key={item.href} end={item.href==="/dashboard"} to={item.href} className={({isActive})=>`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive?"bg-slate-950 text-white":"text-slate-600 hover:bg-slate-100"}`}><Icon size={18}/>{item.label}</NavLink>})}</nav></aside>}
