
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

// Initialize Firebase - but only if we have valid config
let app;
let auth;
let messaging;

try {
  // Only initialize if we have a valid API key (not the dummy one)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "dummy-key") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Messaging is only available in browser environment
    if (typeof window !== 'undefined') {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.warn("Firebase messaging initialization failed:", error);
      }
    }
  } else {
    console.warn("Firebase is not properly configured. Some features may not work.");
    // Create dummy auth object
    auth = {} as any;
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create dummy auth object
  auth = {} as any;
}

// Request notification permission and get token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn("Firebase messaging is not initialized");
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

export { auth };
