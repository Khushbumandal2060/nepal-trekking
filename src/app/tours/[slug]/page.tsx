import { tours } from "../../../data/tours";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default function TourDetail({ params }: Props) {
  const tour = tours.find((t) => t.slug === params.slug);

  if (!tour) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Tour not found</h1>
        <p className="mt-2 text-[var(--color-text-light)]">We couldn't find that trek.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <img src={tour.image} alt={tour.title} className="w-full h-64 object-cover rounded-md" />
          <h1 className="mt-4 text-3xl font-bold">{tour.title}</h1>

          <div className="mt-2 flex items-center gap-4 text-sm text-[var(--color-text-light)]">
            <div>Difficulty: <span className="font-semibold text-[var(--color-primary)]">{tour.difficulty || 'Moderate'}</span></div>
            {tour.maxAltitude && <div>Max altitude: <span className="font-semibold">{tour.maxAltitude} m</span></div>}
            {tour.meetingPoint && <div>Meeting: <span className="font-semibold">{tour.meetingPoint}</span></div>}
          </div>

          <p className="text-[var(--color-text-light)] mt-4">{tour.details}</p>

          {tour.itinerary && (
            <div className="mt-6">
              <h3 className="font-semibold">Itinerary</h3>
              <ol className="mt-2 list-decimal list-inside text-[var(--color-text-light)]">
                {tour.itinerary.map((d, i) => (
                  <li key={i} className="mt-1">{d}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold">Inclusions</h3>
            <ul className="mt-2 list-disc list-inside text-[var(--color-text-light)]">
              {(tour.inclusions || []).map((inc, i) => (
                <li key={i} className="mt-1">{inc}</li>
              ))}
            </ul>
          </div>

          {tour.exclusions && (
            <div className="mt-6">
              <h3 className="font-semibold">Exclusions</h3>
              <ul className="mt-2 list-disc list-inside text-[var(--color-text-light)]">
                {tour.exclusions.map((ex, i) => (
                  <li key={i} className="mt-1">{ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="rounded-lg bg-white p-6">
          <div>
            <div className="text-sm text-[var(--color-text-light)]">Duration</div>
            <div className="font-semibold">{tour.days} days</div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-[var(--color-text-light)]">Price</div>
            <div className="font-semibold text-[var(--color-primary)]">${tour.price}</div>
          </div>

          <div className="mt-6">
            <Link href={`/tours/${tour.slug}/book`} className="block rounded-full bg-[var(--color-primary)] px-5 py-3 text-center text-white">Book now</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
