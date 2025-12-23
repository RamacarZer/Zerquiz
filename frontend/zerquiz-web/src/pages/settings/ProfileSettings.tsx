import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProfileSettings() {
  // Redirect to the full user profile page
  return <Navigate to="/profile" replace />;
}

