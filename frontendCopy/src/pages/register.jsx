import RegisterForm from "../components/registerForm";

export default function RegisterPage({ onRegisterSuccess }) {
  return (
    <div>
      <RegisterForm onRegisterSuccess={onRegisterSuccess} />
    </div>
  );
}
