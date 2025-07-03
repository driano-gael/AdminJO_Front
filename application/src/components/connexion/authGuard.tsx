'use client';

import { useAuth } from '@/contexts/authContext';
import Spinner from '@/components/spinner';
import LoginAdminForm from '@/components/connexion/loginAdminForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <LoginAdminForm />;
  }
  return <>{children}</>;
}