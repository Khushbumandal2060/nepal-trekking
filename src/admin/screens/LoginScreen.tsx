"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/admin/admin-store";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = login(email, password);
        if (result.ok) {
            router.replace("/admin");
        } else {
            setError(result.error ?? "Unable to log in.");
        }
    }

    return (
        <section className="auth-section">
            <svg
                className="auth-ridge"
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    fill="#25324A"
                    fillOpacity="0.06"
                    d="M0,160 L0,96 L140,64 L280,88 L420,48 L560,84 L700,36 L840,72 L980,28 L1120,64 L1260,44 L1440,76 L1440,160 Z"
                />
            </svg>

            <div className="wrap login-wrap">
                <div className="login-card">
                    <div className="login-brand">
                        <svg
                            className="login-brand-icon"
                            viewBox="0 0 56 56"
                            width="54"
                            height="54"
                            aria-hidden="true"
                        >
                            <circle cx="28" cy="24" r="13" fill="#E87936" />
                            <path
                                d="M4 46 L20 20 L28 34 L35 26 L52 46 Z"
                                fill="#25324A"
                            />
                            <path
                                d="M0 46 L0 41 L56 41 L56 46 Z"
                                fill="#25324A"
                            />
                        </svg>
                        <span className="login-brand-name">
                            Trekking <b>Nepal</b>
                        </span>
                    </div>

                    <span className="admin-login-badge">✦ Admin Panel</span>
                    <h1 className="login-heading">Admin sign in</h1>

                    {error && (
                        <div className="admin-login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <label className="login-field">
                            <span>Email</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@example.com"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label className="login-field">
                            <span>Password</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit" className="login-submit">
                            Sign in to admin
                        </button>
                    </form>

                    <p className="login-note">
                        <Link href="/">← Back to website</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
