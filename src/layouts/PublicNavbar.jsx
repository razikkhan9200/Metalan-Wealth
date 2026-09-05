/* layouts/PublicNavbar.jsx: application source file. See README.md for the folder responsibility. */
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";
import { publicNavigation } from "../constants/navigation";

/** Public navigation. Login is the primary entry into the private app. */
export default function PublicNavbar(){
  const [open,setOpen]=useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
      <Link to={ROUTES.HOME} className="text-xl font-bold tracking-tight">Metalan <span className="text-slate-400">Wealth</span></Link>
      <nav className="hidden items-center gap-7 lg:flex">{publicNavigation.map(item=><NavLink key={item.href} to={item.href} className={({isActive})=>`text-sm font-medium ${isActive?"text-slate-950":"text-slate-500 hover:text-slate-950"}`}>{item.label}</NavLink>)}<Link to={ROUTES.LOGIN}><Button size="sm">Login</Button></Link></nav>
      <button className="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="Toggle navigation" onClick={()=>setOpen(v=>!v)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
    {open&&<div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden"><nav className="mx-auto flex max-w-7xl flex-col gap-4">{publicNavigation.map(item=><Link key={item.href} to={item.href} onClick={()=>setOpen(false)} className="text-sm font-medium">{item.label}</Link>)}<Link to={ROUTES.LOGIN} onClick={()=>setOpen(false)}><Button className="w-full">Login</Button></Link></nav></div>}
  </header>;
}
