import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 dashboard-grid">
      {/* Dynamic background decor */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Main Form container */}
      <div className="z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
