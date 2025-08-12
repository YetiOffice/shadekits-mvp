import Layout from '../components/Layout';
import Section from '../components/Section';
export default function Resources() {
  return (
    <Layout>
      <Section title="Install Resources" className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Patio Pro 10×10","Poolside Pavilion 12×12","Café Cover 20×20","Market Pavilion 20×24","Grand Pavilion 24×30"].map((name, i) => (
            <div key={i} className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <div className="font-semibold">{name}</div>
              <div className="text-sm text-neutral-600">PDF Assembly Manual</div>
              <button className="mt-2 rounded-2xl px-3 py-2 border border-neutral-300 text-sm">Download (Placeholder)</button>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <div className="font-semibold">FAQ</div>
          <ul className="list-disc ml-5 text-sm text-neutral-700 space-y-1 mt-2">
            <li>Typical install time: 4–8 hours with 2–3 people.</li>
            <li>Required tools: impact driver, wrenches, level, ladder.</li>
            <li>Permits: Check local requirements for structures over 120 sq ft.</li>
          </ul>
        </div>
      </Section>
    </Layout>
  )
}
