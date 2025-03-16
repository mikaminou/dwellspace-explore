
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS FIRST to ensure styling is available
import "./index.css";
import "./styles/hero.css"; // Import the hero styles
import "./styles/animations.css"; // Import animation styles
import "./styles/base.css"; // Import base styles
import "./styles/language.css"; // Import language styles
import "./styles/map.css"; // Import map styles
import "./styles/property.css"; // Import property styles
import { AuthProvider } from "./contexts/auth";

// Add a global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Create the root and render the app with strict mode disabled in development
// to avoid double rendering which can cause issues with auth providers
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
