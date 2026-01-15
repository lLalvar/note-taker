import { useAuthStore } from '@/store/auth-store'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const initializing = useAuthStore((state) => state.initializing)

  return {
    user,
    initializing,
    isAuthenticated:
      !!user &&
      (user.emailVerified ||
        !user.providerData.some((p) => p.providerId === 'password')),
  }
}
