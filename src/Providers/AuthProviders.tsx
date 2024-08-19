"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProvidersProps {
  children: React.ReactNode;
}

const AuthProviders = ({ children }: AuthProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProviders;
