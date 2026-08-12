"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import GoogleSignInButton from "./GoogleSignInButton";

function Brand() {
    return (
        <div className="login-brand">
            <svg
                className="login-brand-icon"
                viewBox="0 0 56 56"
                width="54"
                height="54"
                aria-hidden="true"
            >
                <circle cx="28" cy="24" r="13" fill="#E87936" />
                <path d="M4 46 L20 20 L28 34 L35 26 L52 46 Z" fill="#25324A" />
                <path d="M0 46 L0 41 L56 41 L56 46 Z" fill="#25324A" />
            </svg>
            <span className="login-brand-name">
                Trekking <b>Nepal</b>
            </span>
        </div>
    );
}

/**
 * Live, session-aware login card.
 *
 * - "Continue with Google" triggers a real OAuth flow (GoogleSignInButton).
 * - useSession() re-renders the card instantly when the sign-in completes,
 *   swapping the form for the signed-in profile.
 */
export default function LoginForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [notice, setNotice] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const email = String(form.email?.value ?? "").trim();
        const password = String(form.password?.value ?? "");

        if (!email || !password) {
            setNotice("Please enter your email and password.");
            return;
        }

        setSubmitting(true);
        setNotice(null);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setNotice("Incorrect email or password. Please try again.");
                return;
            }

            // Success — straight to the user dashboard.
            router.push("/account");
        } catch {
            setNotice("Could not log you in right now. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (status === "loading") {
        return (
            <div className="login-card">
                <Brand />
                <p className="login-status">Checking your session…</p>
            </div>
        );
    }

    if (session?.user) {
        const user = session.user;
        const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
        return (
            <div className="login-card">
                <Brand />
                <h1 className="login-heading">You’re signed in</h1>
                <div className="login-profile">
                    <span className="login-avatar" aria-hidden="true">
                        {initial}
                    </span>
                    <div className="login-profile-copy">
                        <span className="login-profile-name">
                            {user.name || "Trekker"}
                        </span>
                        <span className="login-profile-email">{user.email}</span>
                    </div>
                </div>
                <p className="login-status">Your session is live.</p>
                <div className="btn-row">
                    <Link href="/account" className="btn btn-primary">
                        Go to your dashboard
                    </Link>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-card">
            <Brand />
            <h1 className="login-heading">Welcome back</h1>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <label className="login-field">
                    <span>Email</span>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </label>
                <label className="login-field">
                    <span className="login-field-head">
                        Password
                        <Link href="/forgot-password" className="login-forgot">
                            Forgot password?
                        </Link>
                    </span>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="login-submit"
                    disabled={submitting}
                >
                    {submitting ? "Logging in…" : "Log in"}
                </button>
            </form>

            {notice && (
                <p className="login-error" role="alert">
                    {notice}
                </p>
            )}

            <div className="login-divider" aria-hidden="true">
                <span>or continue with</span>
            </div>

            <GoogleSignInButton callbackUrl="/account" />

            <p className="login-note">
                New here? <Link href="/register">Create an account</Link>
            </p>
        </div>
    );
}
