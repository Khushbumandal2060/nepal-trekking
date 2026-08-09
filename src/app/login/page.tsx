import Link from "next/link";

export const metadata = {
    title: "Login · Trekking Nepal",
    description:
        "Log in to your Trekking Nepal account to manage your bookings, saved treks, and expedition plans.",
};

export default function LoginPage() {
    return (
        <>
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

                        <h1 className="login-heading">Welcome back</h1>

                        <form className="login-form">
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
                                    <Link
                                        href="/forgot-password"
                                        className="login-forgot"
                                    >
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
                            <button type="submit" className="login-submit">
                                Log in
                            </button>
                        </form>

                        <div className="login-divider" aria-hidden="true">
                            <span>or sign in with email</span>
                        </div>

                        <button type="button" className="login-google">
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="login-note">
                            New here?{" "}
                            <Link href="/register">Create an account</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
