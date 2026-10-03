import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    let user = null;

    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        // If the data is corrupted, clear it out
        localStorage.removeItem('user');
    }

    // 1. If not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the route requires a specific role and the user doesn't have it, kick them to home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. If logged in and authorized, render the page
    return children;
}