// src/components/ui/alert.jsx
import React from "react";
export function Alert({ children, ...props }) { 
  return <div className="alert" {...props}>{children}</div>; 
}
export function AlertDescription({ children }) { 
  return <div className="alert-description">{children}</div>; 
}
