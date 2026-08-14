"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Client-side session context. Wrapping the app here lets every component
 * read the current auth state live via useSession() and re-render the moment
 * a Google sign-in / sign-out completes.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
