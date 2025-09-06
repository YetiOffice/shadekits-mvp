import Link from "next/link";
import Layout from "../components/Layout";
import MetaStrip from "../components/MetaStrip";
import FAQMini from "../components/FAQMini";

const SPEC_PACK_URL = process.env.NEXT_PUBLIC_SPEC_PACK_URL || "/spec-pack.pdf";

const docs = [
  { title: "Anchoring Overview", href: SPEC_PACK_URL, note: "PDF" },
  { title: "Finish & Care", href: SPEC_PACK_URL, note: "PDF" },
  { title: "Wind / Snow / Permitting Notes", href: SPEC_PACK_URL, note: "PDF" },
  { title: "Warranty Summary", href: SPEC_PACK_URL, note: "PDF" },
];

export default function ResourcesPage() {
  return (
    <Layout title="Install Resources \u2014 ShadeKits">
      <MetaStrip />
      <div className="container-7xl mb-16">
        <h1 className="mb-6">Install Resources</h1>

        {/* Spec Pack hero */}
        <div className="card p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Spec Pack (PDF)</div>
            <div className="text-sm text-neutral-700">
              Cut sheet, finishes, anchoring options, install overview, wind/snow guidance, warranty, and contact.
            </div>
          </div>
          <a
            href={SPEC_PACK_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            Download PDF
          </a>
        </div>

        {/* Document list */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc) => (
            <div key={doc.title} className="card p-4">
              <div className="font-semibold">{doc.title}</div>
              <div className="text-sm text-neutral-600">{doc.note}</div>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener"
                className="btn btn-secondary mt-2"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>
      <FAQMini />
    </Layout>
  );
}
