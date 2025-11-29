import React from 'react';
import { authStore } from '../../store/authStore';
import { Navigate } from 'react-router';

function UserProtectedRoute({ children }) {
    const { token } = authStore();

    if (!token) {
        // 로그인 안 한 경우 → 로그인 페이지로 이동
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default UserProtectedRoute;