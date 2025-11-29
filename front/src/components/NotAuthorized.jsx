// src/pages/NotAuthorized.jsx
import React from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{position:"absolute", top:"50%",left:"50%", textAlign:"center", transform: "translate(-50%, -50%)"}}>
      <h1>🚫 접근이 제한되었습니다</h1>
      <p style={{marginTop:"30px", marginBottom:"30px"}}>이 페이지는 관리자만 접근할 수 있습니다.</p>
      <div className="short_btn_bg">
        <Link Link to="/" className="btn_50_b">메인으로</Link>
      </div>
      
    </div>
  );
};

export default NotAuthorized;
