
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

// Setup error handler for debugging
console.log("main.tsx - Setting up global error handler");
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error location:', event.filename, 'line:', event.lineno, 'column:', event.colno);
});

// Initialize app
console.log("main.tsx - Starting app initialization");

// Create root with explicit null check and error handling
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found in DOM");
    const fallbackRoot = document.createElement("div");
    fallbackRoot.id = "root";
    document.body.appendChild(fallbackRoot);
    console.log("Created fallback root element");
  }
  
  // Create the root with a more defensive approach
  console.log("Creating root element...");
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  
  console.log("main.tsx - Rendering App");
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
  console.log("main.tsx - App rendered");
} catch (error) {
  console.error("Critical error during app initialization:", error);
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px; text-align: center;">
      <h1 style="color: #e11d48; margin-bottom: 16px;">Critical Error</h1>
      <p style="margin-bottom: 16px;">The application failed to initialize. Please try refreshing the page.</p>
      <p style="color: #6b7280; margin-bottom: 24px;">Error: ${error instanceof Error ? error.message : String(error)}</p>
      <button onclick="window.location.reload()" style="background-color: #27AE60; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; border: none;">
        Refresh Page
      </button>
    </div>
  `;
}
