import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Tell us where you want to go — fill in a few details and a Kathmandu-based trek expert will reply within 24 hours with route options, dates, and pricing.",
};

const OFFICE_DETAILS: { b: string; text: string }[] = [
    { b: "Address", text: "Trekking Nepal, Thamel, Kathmandu 44600, Nepal" },
    { b: "Phone", text: "+977 1 4XX XXXX (sample number)" },
    { b: "Email", text: "hello@trekkingnepal.example" },
    {
        b: "Office Hours",
        text: "Sunday\u2013Friday, 9:00\u201318:00 NPT (Nepal is closed Saturdays)",
    },
    {
        b: "Response Time",
        text: "Enquiries are typically answered within 24 hours during office days.",
    },
];

export default function ContactPage() {
    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="eyebrow">Contact</div>
                    <h1>Tell us where you want to go.</h1>
                    <p className="lede">
                        Fill in a few details and a Kathmandu-based trek expert will
                        reply within 24 hours with route options, dates and pricing.
                    </p>
                </div>
            </section>

            <section>
                <div className="wrap split reveal">
                    <div className="contact-card">
                        <div className="sec-eyebrow">Plan My Trek</div>
                        <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 30 }}>
                            Send an enquiry
                        </h2>
                        <ContactForm />
                    </div>

                    <div className="contact-card">
                        <div className="sec-eyebrow">Reach Us Directly</div>
                        <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 30 }}>
                            Office details
                        </h2>
                        <ul className="value-list">
                            {OFFICE_DETAILS.map((d) => (
                                <li key={d.b}>
                                    <b>{d.b}</b>
                                    {d.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
