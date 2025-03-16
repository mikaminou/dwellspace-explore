
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

// Add a global error handler with more detailed logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error source:', event.filename, 'Line:', event.lineno, 'Column:', event.colno);
});

// Make sure we can find the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found in DOM");
  // Try to create it as a fallback
  const fallbackRoot = document.createElement('div');
  fallbackRoot.id = 'root';
  document.body.appendChild(fallbackRoot);
  console.log("Created fallback root element");
}

// Create and render the app with React 18 createRoot API
try {
  const root = createRoot(rootElement || document.body);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Failed to render React application:", error);
  // Display a visible error message on the page
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center;">
      <h2>Application Error</h2>
      <p>There was an error rendering the application.</p>
      <p>Error details: ${error instanceof Error ? error.message : String(error)}</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}
