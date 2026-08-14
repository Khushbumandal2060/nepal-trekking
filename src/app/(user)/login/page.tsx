import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Login",
    description:
        "Log in to your Trekking Nepal account to manage your bookings, saved treks, and expedition plans.",
    path: "/login",
    noIndex: true,
});

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
                    <LoginForm />
                </div>
            </section>
        </>
    );
}
