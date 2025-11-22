import LoginForm from "../components/loginForm";

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
