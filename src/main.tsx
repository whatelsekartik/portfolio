import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./mobile-polish.css";
import "./project-case-study.css";
import "./contributions.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
