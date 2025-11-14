import { useState, useEffect } from "react";
import LoginPage from "./login";
import RegisterPage from "./register";
import Dashboard from "./dashboard";

export default function PageContainer() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setPage("dashboard");
  };

  const handleRegisterSuccess = () => {
    setPage("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case "register":
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} />;
      case "dashboard":
        return <Dashboard token={token} onLogout={handleLogout} />;
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div>
      {page !== "dashboard" && (
        <nav>
          <button
            onClick={() => setPage("login")}
            className={page === "login" ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setPage("register")}
            className={page === "register" ? "active" : ""}
          >
            Register
          </button>
        </nav>
      )}
      <div>{renderPage()}</div>
    </div>
  );
}
