import React from "react";
import "./App.css";

export default function App() {
  return (
    <div className="container">
      <div className="card">
        <img
          src="./logo.png"
          className="logo"
          alt="Logo"
        />

        <h1 className="title">投票系统测试页</h1>

        <div className="btn-group">
          <a href="/vote25" className="btn">
            投票页面
          </a>
          <a href="/api25" className="btn secondary">
            后端
          </a>
        </div>
      </div>
    </div>
  );
}
