"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookPage({ params }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [people, setPeople] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | string>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour: params.slug,
          name,
          email,
          people,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Booking received. We'll contact you soon.");
      } else {
        setSuccess(data?.error || "An error occurred");
      }
    } catch (err) {
      setSuccess("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Book your trek</h1>
      <p className="text-[var(--color-text-light)] mt-2">Fill out the form and our team will follow up to confirm availability.</p>

      <form onSubmit={handleSubmit} className="mt-6 rounded-lg bg-white p-6">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block w-full rounded border px-3 py-2" placeholder="Full name" required />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 block w-full rounded border px-3 py-2" placeholder="you@example.com" required />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Number of people</span>
          <input value={people} onChange={(e) => setPeople(Number(e.target.value))} type="number" min={1} className="mt-2 block w-24 rounded border px-3 py-2" />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Message</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 block w-full rounded border px-3 py-2" rows={4} placeholder="Any special requests or dates" />
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button type="submit" disabled={loading} className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-white">{loading ? "Sending..." : "Request booking"}</button>
          <button type="button" onClick={() => router.back()} className="text-sm text-[var(--color-text-light)]">Cancel</button>
        </div>

        {success && <div className="mt-4 text-sm text-[var(--color-primary)]">{success}</div>}
      </form>
    </div>
  );
}
