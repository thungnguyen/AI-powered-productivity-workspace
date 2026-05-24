'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@zennote.com', // Pre-populated for easy testing
      password: 'admin123',
    },
  });

  // React Query Mutation to login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      // Calls C# backend endpoint POST /api/v1/auth/login
      const response = await apiClient.post<string>('/auth/login', data);
      return response;
    },
    onSuccess: (response, variables) => {
      const token = response.data;
      // Mock user metadata (in real app, fetched or decoded from JWT)
      const userProfile = {
        email: variables.email,
        displayName: variables.email === 'admin@zennote.com' ? 'ZenNote Admin' : 'User',
      };

      setAuth(token, userProfile);
      router.replace('/dashboard');
    },
    onError: (error: unknown) => {
      console.error('Login request failed', error);
      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          setGeneralError(error.errors.join('. '));
        } else {
          setGeneralError(error.message);
        }
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('Invalid email or password.');
      }
    },
  });

  const onSubmit = (data: LoginSchema) => {
    setGeneralError(null);
    loginMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="relative w-full max-w-md p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-primary/5 to-purple-500/20 shadow-2xl dark:shadow-indigo-900/10"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20 blur-xl opacity-30 pointer-events-none" />

      <Card className="border border-border/60 bg-card/85 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-lg relative overflow-hidden group">
              <span className="relative z-10">Z</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">
            Sign in to ZenNote
          </CardTitle>
          <CardDescription className="text-center text-xs">
            Enter your credentials or use the mock admin account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive"
              >
                {generalError}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                error={!!errors.email}
                className="bg-muted/30 border-border/80 focus-visible:ring-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[10px] font-semibold text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </span>
                <span className="text-[10px] text-muted-foreground hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={!!errors.password}
                  className="bg-muted/30 border-border/80 pr-10 focus-visible:ring-primary"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-semibold text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full relative overflow-hidden group shadow-md"
              isLoading={loginMutation.isPending}
            >
              <span className="flex items-center gap-2">
                Sign in
                <Sparkles className="h-3.5 w-3.5 text-indigo-200 group-hover:animate-pulse" />
              </span>
            </Button>

            <div className="text-center text-[10px] text-muted-foreground leading-normal mt-1">
              Demo access: <code className="bg-muted px-1.5 py-0.5 rounded font-mono">admin@zennote.com</code> / <code className="bg-muted px-1.5 py-0.5 rounded font-mono">admin123</code>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
