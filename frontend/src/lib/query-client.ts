import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Avoid excessive network requests on window focus
      retry: (failureCount, error: unknown) => {
        // Do not retry on auth or validation errors
        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          ((error as { status: number }).status === 401 ||
            (error as { status: number }).status === 400 ||
            (error as { status: number }).status === 404)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
