// src/components/ui/select.jsx
import React from "react";
export function Select({ children, ...props }) { return <select {...props}>{children}</select>; }
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ children, ...props }) { return <option {...props}>{children}</option>; }
export function SelectTrigger({ children }) { return <>{children}</>; }
export function SelectValue({ placeholder }) { return <span>{placeholder}</span>; }
