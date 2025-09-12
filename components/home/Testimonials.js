import { useRef } from "react";
import Section from "../Section";

const QUOTES = [
  { q: "We use our patio year-round now. The kit went together flawlessly.", a: "Alicia P., AZ" },
  { q: "Rock-solid in wind and looks incredible. Customers love our new outdoor seating.", a: "Jordan R., Restaurant Owner" },
  { q: "Clear instructions and great support. Best upgrade we’ve done.", a: "Mike T., TX" },
];

export default function Testimonials() {
  const container = useRef(null);
  return (
    <Section className="py-16" id="testimonials">
      <div className="text-center">
        <div className="label">/ Customer Testimonials</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Loved by Homeowners & Pros</h2>
      </div>

      <div
        ref={container}
        className="mt-8 grid gap-6 md:grid-cols-3"
      >
        {QUOTES.map((t, i) => (
          <figure key={i} className="card p-6">
            <blockquote className="text-lg leading-relaxed">“{t.q}”</blockquote>
            <figcaption className="mt-4 text-sm text-neutral-600">— {t.a}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
