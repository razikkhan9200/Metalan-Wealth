/* App.jsx: application source file. See README.md for the folder responsibility. */
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useLenis from "./hooks/useLenis";
import Toaster from "./components/ui/Toaster";

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <AppRoutes />
      {/* Mounted once, as a sibling of the routed pages rather than
          inside one of them, so a toast started on one page (e.g.
          "Signing you in...") is still visible after navigation
          redirects to another. */}
      <Toaster />
    </BrowserRouter>
  );
}