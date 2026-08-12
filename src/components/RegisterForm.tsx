"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "./GoogleSignInButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<
    Record<"fullName" | "email" | "password" | "confirm", string>
>;

const STRENGTH_LABELS = ["", "Weak", "Weak", "Fair", "Good", "Strong"];

function ratePassword(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return Math.min(score, 5);
}

export default function RegisterForm() {
    const router = useRouter();
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const score = ratePassword(password);
    const strengthLabel = password ? STRENGTH_LABELS[score] : "";

    function validate(): FieldErrors {
        const next: FieldErrors = {};
        if (fullName.trim().length < 2) {
            next.fullName = "Please enter your full name.";
        }
        if (!EMAIL_RE.test(email)) {
            next.email = "Enter a valid email address.";
        }
        if (password.length < 8) {
            next.password = "Use at least 8 characters.";
        }
        if (confirm !== password) {
            next.confirm = "Passwords do not match.";
        }
        return next;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSubmitting(true);
        setApiError(null);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    email,
                    password,
                }),
            });
            const data = (await res.json()) as {
                ok?: boolean;
                error?: string;
            };

            if (!res.ok || !data?.ok) {
                setApiError(data?.error ?? "Could not create your account. Please try again.");
                return;
            }

            // Auto sign-in with the freshly created credentials.
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                // Session created but auto-login failed — send them to the login page.
                router.push("/login");
                return;
            }

            setSent(true);
        } catch {
            setApiError("Could not create your account right now. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    function reset() {
        setSent(false);
        setErrors({});
        setFullName("");
        setEmail("");
        setPhone("");
        setCountry("");
        setPassword("");
        setConfirm("");
    }

    if (sent) {
        return (
            <div className="login-card" style={{ textAlign: "center" }}>
                <div className="contact-success-icon" aria-hidden="true">
                    ✓
                </div>
                <h3
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 26,
                        marginBottom: 10,
                    }}
                >
                    Account created
                </h3>
                <p style={{ color: "var(--sub)", lineHeight: 1.65 }}>
                    Thanks, {fullName.split(" ")[0] || "there"} — your Trekking Nepal
                    account is ready and you’re signed in.
                </p>
                <div className="btn-row" style={{ marginTop: 24 }}>
                    <Link href="/account" className="btn btn-primary">
                        Go to your dashboard
                    </Link>
                    <button type="button" className="btn btn-ghost" onClick={reset}>
                        Register another account
                    </button>
                </div>
            </div>
        );
    }

    return (
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
                    <path d="M4 46 L20 20 L28 34 L35 26 L52 46 Z" fill="#25324A" />
                    <path d="M0 46 L0 41 L56 41 L56 46 Z" fill="#25324A" />
                </svg>
                <span className="login-brand-name">
                    Trekking <b>Nepal</b>
                </span>
            </div>

            <h1 className="login-heading">Create your account</h1>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-grid">
                    <div className="login-field">
                        <label htmlFor="reg-fullName">Full name</label>
                        <input
                            id="reg-fullName"
                            type="text"
                            name="fullName"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            aria-invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName && (
                            <span className="login-error" role="alert">
                                {errors.fullName}
                            </span>
                        )}
                    </div>

                    <div className="login-field">
                        <label htmlFor="reg-phone">Phone / WhatsApp</label>
                        <input
                            id="reg-phone"
                            type="tel"
                            name="phone"
                            placeholder="+977"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div className="login-field">
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                        <span className="login-error" role="alert">
                            {errors.email}
                        </span>
                    )}
                </div>

                <div className="login-grid">
                    <div className="login-field">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            name="password"
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={Boolean(errors.password)}
                        />
                        {password && (
                            <div className="password-meter" aria-hidden="true">
                                <span className="meter-bars">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <i key={i} className={i < score ? "fill" : ""} />
                                    ))}
                                </span>
                                <span className="meter-label">{strengthLabel}</span>
                            </div>
                        )}
                        {errors.password && (
                            <span className="login-error" role="alert">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <div className="login-field">
                        <label htmlFor="reg-confirm">Confirm password</label>
                        <input
                            id="reg-confirm"
                            type="password"
                            name="confirm"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            aria-invalid={Boolean(errors.confirm)}
                        />
                        {errors.confirm && (
                            <span className="login-error" role="alert">
                                {errors.confirm}
                            </span>
                        )}
                    </div>
                </div>

                {apiError && (
                    <p className="login-error" role="alert">
                        {apiError}
                    </p>
                )}

                <button
                    type="submit"
                    className="login-submit"
                    disabled={submitting}
                >
                    {submitting ? "Creating account…" : "Create account"}
                </button>
            </form>

            <div className="login-divider" aria-hidden="true">
                <span>or sign up with email</span>
            </div>

            <GoogleSignInButton label="Sign up with Google" callbackUrl="/account" />

            <p className="login-note">
                Already have an account? <Link href="/login">Log in here</Link>.
            </p>
        </div>
    );
}
