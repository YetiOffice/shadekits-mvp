import Section from "../Section";

const QA = [
  {
    q: "How is our system different?",
    a: "We prioritize strength, finish, and real-world engineering. Bolt-together steel, precision panels, and a broad accessory ecosystem.",
  },
  {
    q: "What’s it made of?",
    a: "Structural steel with durable finishes and stainless fasteners. Designed for wind, snow, and daily use.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes — limited lifetime on structure. See details on our Warranty page.",
  },
  {
    q: "Lead times?",
    a: "Most standard kits ship in 3–4 weeks. Custom timelines vary by scope and permitting.",
  },
];

export default function FAQ() {
  return (
    <Section className="py-16" id="faq">
      <div className="text-center">
        <div className="label">/ Why ShadeKits?</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Answers to Common Questions</h2>
      </div>

      <div className="mt-8 grid gap-4">
        {QA.map((item) => (
          <details key={item.q} className="card p-5">
            <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
            <p className="mt-3 text-neutral-700">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
