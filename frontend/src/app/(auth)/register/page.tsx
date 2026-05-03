import { RegisterForm } from "@/features/auth/components/RegisterForm";

/**
 * Register Page (Server Component).
 * Middleware handles redirects for authenticated users.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
