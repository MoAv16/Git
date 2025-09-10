// src/components/ui/progress.jsx
import React from "react";
export function Progress({ value, ...props }) { 
  return <progress value={value} {...props} />; 
}
