import React from "react";
import { Navigate } from "react-router";
import { authStore } from "../../store/authStore";

function AdminProtectedRoute({ children }) {
  const { token, userRole } = authStore();

  if (!token) {
    // 로그인 안 한 경우 → 로그인 페이지로 이동
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "ROLE_ADMIN") {
    // 로그인은 했지만 일반 사용자 → 접근 차단 페이지
    return <Navigate to="/not-authorized" replace />;
  }

  // 관리자일 경우만 자식 컴포넌트 렌더링
  return children;
}

export default AdminProtectedRoute;
