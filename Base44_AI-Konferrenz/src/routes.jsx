import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ConversationRoom from './pages/ConversationRoom.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/conference" replace />} />
      <Route path="/conference" element={<ConversationRoom />} />
      {/* Weitere Seiten hier */}
      <Route path="*" element={<Navigate to="/conference" replace />} />
    </Routes>
  )
}
