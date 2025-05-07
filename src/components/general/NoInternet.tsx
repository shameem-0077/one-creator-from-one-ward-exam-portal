"use client";

import { useEffect, useState } from "react";

export default function NoInternet() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      document.body.classList.remove("offline-mode"); // Remove disabled state
    };

    const handleOffline = () => {
      setIsOnline(false);
      document.body.classList.add("offline-mode"); // Add disabled state
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);
    if (!navigator.onLine) document.body.classList.add("offline-mode");

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null; // Do nothing when online

  return (
    <div 
      style={{
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(0,0,0,0.5)", 
        color: "white", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        fontSize: "20px", 
        zIndex: 9999
      }}
    >
      <h1>🚫 No Internet</h1>
      <p>Actions are disabled until you're back online.</p>
    </div>
  );
}
