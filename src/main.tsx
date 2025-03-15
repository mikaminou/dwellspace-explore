
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/hero.css"; // Import the hero styles
import "./styles/animations.css"; // Import animation styles
import "./styles/base.css"; // Import base styles
import "./styles/language.css"; // Import language styles
import "./styles/map.css"; // Import map styles
import "./styles/property.css"; // Import property styles
import { AuthProvider } from "./contexts/auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
