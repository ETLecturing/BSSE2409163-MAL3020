import LoginForm from "../components/loginForm";

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
