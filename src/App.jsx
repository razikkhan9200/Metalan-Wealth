/* App.jsx: application source file. See README.md for the folder responsibility. */
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useLenis from "./hooks/useLenis";

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}