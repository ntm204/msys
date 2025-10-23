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
            background: "#363636",
            color: "#fff",
            whiteSpace: "nowrap",
            overflowX: "auto",
            textOverflow: "ellipsis",
            maxWidth: "90vw",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              whiteSpace: "nowrap",
              overflowX: "auto",
              textOverflow: "ellipsis",
              maxWidth: "90vw",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
              whiteSpace: "nowrap",
              overflowX: "auto",
              textOverflow: "ellipsis",
              maxWidth: "90vw",
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
