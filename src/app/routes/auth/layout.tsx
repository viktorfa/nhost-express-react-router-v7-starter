"use client";
import { Navigate, Outlet } from "react-router";
import { NhostContext } from "@/lib/NhostContext";
import { useAuthenticationStatus } from "@nhost/react";
import { LoadingElement } from "@/components/LoadingElement";
import { ClientOnly } from "@/components/ClientOnly";

export default function AuthLayout() {
  return (
    <ClientOnly>
      <NhostContext>
        <AuthRedirectWrapper>
          <Outlet />
        </AuthRedirectWrapper>
      </NhostContext>
    </ClientOnly>
  );
}

const AuthRedirectWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return <LoadingElement />;
  } else if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
