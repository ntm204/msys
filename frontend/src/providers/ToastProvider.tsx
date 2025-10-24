"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#374151",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            fontWeight: 500,
            fontSize: "16px",
            padding: "12px 20px",
            whiteSpace: "nowrap",
            overflowX: "auto",
            textOverflow: "ellipsis",
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
