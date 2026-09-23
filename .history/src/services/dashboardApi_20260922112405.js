import { get } from "./Api";

export function getDashboard() {
  return get("/dashboard");
}