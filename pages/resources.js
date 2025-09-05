// pages/resources.js
import Link from "next/link";
import Layout from "../components/Layout";
import MetaStrip from "../components/MetaStrip";
import FAQMini from "../components/FAQMini";

const SPEC_PACK_URL = process.env.NEXT_PUBLIC_SPEC_PACK_URL || "/spec-pack.pdf";

const docs = [
  { title: "Anchoring Overview", href: "#", note: "PDF" },
  { title: "Finish & Care", href: "#", note: "PDF" },
  { title: "Wind / Snow / Permitting Notes", href: "#", note: "PDF" },
  { title: "Warranty Summary", href: "#", note: "PDF" },
];

export default function ResourcesPage() {
  return (
    <Layout title="Install Resources — ShadeKits">
      <MetaStrip />

      <div className="container-7xl mb-16">
        <h1 className="mb-6">Install Resources</h1>

        {/* Spec Pack hero */}
        <div className="card p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Spec Pack (PDF)</div>
            <div className="text-sm text-neutral-700">
              Cut sheet, finishes, anchoring options, install overview, wind/snow guidance, warranty, and contact.
            </div>
          </div>
          <a className="btn-primary" href={SPEC_PACK_URL} target="_blank" rel="noreferrer">
            Download Spec Pack
          </a>
        </div>

        {/* Other documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((d, i) => (
            <div key={i} className="card p-4">
              <div className="font-medium">{d.title}</div>
              <div className="text-sm text-neutral-700 mb-3">{d.note}</div>
              <a className="btn-ghost" href={d.href}>Download PDF</a>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <FAQMini title="Quick FAQ" />
        </div>
      </div>
    </Layout>
  );
}
