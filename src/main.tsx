
import React from "react";
import { createRoot } from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS FIRST to ensure styling is available
import App from "./App";
import "./index.css";
import "./styles/hero.css"; // Import the hero styles
import "./styles/animations.css"; // Import animation styles
import "./styles/base.css"; // Import base styles
import "./styles/language.css"; // Import language styles
import "./styles/map.css"; // Import map styles
import "./styles/property.css"; // Import property styles
import { AuthProvider } from "./contexts/auth";

// Make sure we can find the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found in DOM");
  throw new Error("Root element not found");
}

// Create and render the app with React 18 createRoot API
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
