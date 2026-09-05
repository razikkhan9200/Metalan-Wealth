/* layouts/PublicLayout.jsx: application source file. See README.md for the folder responsibility. */
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

/** Shared shell for all public marketing pages. */
export default function PublicLayout(){ return <div className="min-h-screen overflow-x-hidden bg-white"><PublicNavbar/><main><Outlet/></main><PublicFooter/></div>; }
