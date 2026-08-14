import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Create Account",
    description:
        "Create a Trekking Nepal account to save treks, manage your bookings, and speed up expedition enquiries.",
    path: "/register",
    noIndex: true,
});

export default function RegisterPage() {
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
                <RegisterForm />
            </div>
        </section>
    );
}
