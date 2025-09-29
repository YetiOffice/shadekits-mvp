import Layout from "../components/Layout";
import { useState } from "react";

const COMPANY_NAME = "ShadeKits";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID; // optional

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout title={`Support — ${COMPANY_NAME}`}>
      <div className="container-7xl py-12 max-w-2xl">
        <h1 className="mb-2">Support</h1>
        <p className="text-neutral-700 mb-6">
          Need help with an order, install, or a question about kits? Send us a message and we’ll get back to you.
        </p>

        {FORMSPREE_ID ? (
          <form
            action={`https://formspree.io/f/${FORMSPREE_ID}`}
            method="POST"
            className="grid gap-4"
            onSubmit={() => setSubmitted(true)}
          >
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input name="name" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input name="email" type="email" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea name="message" rows={5} required className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="btn btn-primary">Send</button>
            {submitted && (
              <p className="text-sm text-green-700">Thanks! Your message has been sent.</p>
            )}
          </form>
        ) : (
          <div className="prose">
            <p>
              Email us at{" "}
              <a className="underline" href="mailto:support@shadekits.com">
                support@shadekits.com
              </a>{" "}
              and include your order number if available.
            </p>
          </div>
        )}

        <div className="prose mt-10">
          <h2>Common Topics</h2>
          <ul>
            <li>Order status &amp; lead times</li>
            <li>Freight &amp; delivery logistics</li>
            <li>Install resources and anchoring options</li>
            <li>Warranty &amp; replacement parts</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
