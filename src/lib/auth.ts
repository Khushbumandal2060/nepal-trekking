import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail, verifyPassword } from "./users";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Two sign-in methods are supported:
 *   1. Email/password (Credentials provider)  — verified against the
 *      `users` table in PostgreSQL (bcrypt password hash).
 *   2. Google OAuth                            — classic OAuth flow.
 *
 * Sessions are signed JWTs stored in an httpOnly cookie, so no session
 * table is required and the session survives both client (useSession)
 * and server (auth()) reads.
 *
 * Required environment variables (see .env.example):
 *   - AUTH_SECRET         generate with `npx auth secret`
 *   - DATABASE_URL        e.g. postgres://postgres:secret@localhost:5432/trekking_nepal
 *   - AUTH_GOOGLE_ID      (optional) OAuth Client ID for Google sign-in
 *   - AUTH_GOOGLE_SECRET  (optional) OAuth Client Secret for Google sign-in
 *
 * Authorized redirect URI for local dev:
 *   http://localhost:3000/api/auth/callback/google
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google,
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email =
                    typeof credentials?.email === "string"
                        ? credentials.email.trim().toLowerCase()
                        : "";
                const password =
                    typeof credentials?.password === "string"
                        ? credentials.password
                        : "";

                if (!email || !password) return null;

                const user = await findUserByEmail(email);
                if (!user) return null;

                // Only email/password accounts can sign in with a password.
                if (user.provider !== "credentials" || !user.password_hash) {
                    return null;
                }

                const valid = await verifyPassword(password, user.password_hash);
                if (!valid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image ?? undefined,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // On first sign-in (credentials or Google), carry the user id over.
            if (account && user) {
                token.id = user.id;
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id ?? "");
            }
            return session;
        },
    },
    trustHost: true,
});
