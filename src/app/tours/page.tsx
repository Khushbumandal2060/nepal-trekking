import Link from "next/link";
import { tours } from "../../data/tours";

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Our Treks</h1>
      <p className="text-[var(--color-text-light)] mt-2">Choose from curated itineraries led by experienced local guides.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map((t) => (
          <article key={t.slug} className="trek-card rounded-lg bg-white p-4">
            <img src={t.image} alt={t.title} className="w-full h-36 object-cover rounded-md" />
            <div className="mt-3 flex items-center justify-between">
              <h3 className="font-semibold">{t.title}</h3>
              <span className="text-sm text-[var(--color-text-light)]">{t.difficulty || ""}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-[var(--color-text-light)]">{t.days} days • {t.meetingPoint}</div>
              <span className="font-medium text-[var(--color-primary)]">${t.price}</span>
            </div>
            <p className="text-sm text-[var(--color-text-light)] mt-2">{t.summary}</p>

            <div className="mt-3 flex items-center justify-between">
              <Link href={`/tours/${t.slug}`} className="text-sm text-[var(--color-primary)]">Details</Link>
              {t.inclusions && <span className="text-xs text-[var(--color-text-light)]">Includes: {t.inclusions.slice(0,2).join(', ')}{t.inclusions.length>2?'…':''}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
