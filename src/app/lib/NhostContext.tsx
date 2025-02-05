"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { useNhost } from "@/lib/hooks";
import { NhostProvider, useAuthenticationStatus } from "@nhost/react";
import { LoadingElement } from "@/components/LoadingElement";
import { Navigate } from "react-router";

const queryClient = new QueryClient();

export const NhostContext = ({ children }: { children: React.ReactNode }) => {
  const nhostClient = useNhost();

  return <NhostProvider nhost={nhostClient}>{children}</NhostProvider>;
};

export const GraphqlContext = ({ children }: { children: React.ReactNode }) => {
  const nhostClient = useNhost();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return <LoadingElement />;
  } else if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NhostApolloProvider nhost={nhostClient}>{children}</NhostApolloProvider>
    </QueryClientProvider>
  );
};
