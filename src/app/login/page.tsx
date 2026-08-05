import Link from "next/link";

export const metadata = {
    title: "Login · Trekking Nepal",
    description:
        "Log in to your Trekking Nepal account to manage your bookings, saved treks, and expedition plans.",
};

export default function LoginPage() {
    return (
        <>
            <section>
                <div className="wrap login-wrap reveal">
                    <div className="login-card">
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
                                <span>Password</span>
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
                        <p className="login-note">
                            New here?{" "}
                            <Link href="/contact">
                                Contact us to create your account
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
