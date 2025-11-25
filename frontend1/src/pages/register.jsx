import RegisterForm from "../components/registerForm";

export default function RegisterPage({ onRegisterSuccess }) {
  return (
    <div>
      <h1>Register Page</h1>
      <RegisterForm onRegisterSuccess={onRegisterSuccess} />
    </div>
  );
}
