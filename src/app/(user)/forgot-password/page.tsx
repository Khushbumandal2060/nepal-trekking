import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Forgot Password",
    description:
        "Reset your Trekking Nepal password. Enter your email and we'll send you a reset link.",
    path: "/forgot-password",
    noIndex: true,
});

export default function ForgotPasswordPage() {
    return (
        <section className="auth-section">
            <div className="wrap login-wrap">
                <div className="login-card">
                    <h1 className="login-heading">Reset your password</h1>
                    <p className="login-sub">
                        Enter your account email and we’ll send you a link to reset
                        your password.
                    </p>
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
                        <button type="submit" className="login-submit">
                            Send reset link
                        </button>
                    </form>
                    <p className="login-note">
                        Remembered it? <Link href="/login">Back to login</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
