// pages/contact.js
import { useRef, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import MetaStrip from "../components/MetaStrip";
import FAQMini from "../components/FAQMini";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "office@yetiwelding.com";
  const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const data = new FormData(formRef.current);
    data.append("_subject", "[ShadeKits] Contact request");

    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          window.location.href = "/thank-you";
          return;
        }
        setError("Sorry—something went wrong. Please try again.");
      } else {
        // mailto fallback (no file attachments)
        const body = encodeURIComponent(
          `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\n\nMessage:\n${data.get("message")}\n`
        );
        const subject = encodeURIComponent("[ShadeKits] Contact request");
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout title="Contact — ShadeKits">
      <MetaStrip />

      <div className="container-7xl mb-16">
        <h1 className="mb-6">Get a Free Quote</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Form */}
          <div className="card p-4">
            <p className="muted mb-4">
              Send us your project details and we’ll reply in 24–48 hours with a concept image and detailed spec.
            </p>

            <form ref={formRef} onSubmit={onSubmit} className="grid gap-3" noValidate>
              <div>
                <label htmlFor="name" className="label">Name</label>
                <input id="name" name="name" className="input" required />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input id="email" name="email" type="email" className="input" required />
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone</label>
                <input id="phone" name="phone" className="input" />
              </div>
              <div>
                <label htmlFor="message" className="label">Message</label>
                <textarea id="message" name="message" rows={4} className="input" placeholder="Site details, timeline, constraints" />
              </div>

              {error && <div className="text-sm text-rose-700">{error}</div>}

              <div className="flex items-center gap-3">
                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Request Concept & Price"}
                </button>
                <span className="text-sm text-neutral-600">or call <a href="tel:+18109958906" className="underline">+1 (810) 995-8906</a></span>
              </div>

              <div className="text-xs text-neutral-500 mt-1">
                No obligation. We’ll reply within 24–48 hours.
              </div>
            </form>
          </div>

          {/* Aside */}
          <div className="grid gap-3">
            <div className="card p-4">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Contact</div>
              <div className="text-sm">
                <div>Email: <a className="underline" href="mailto:office@yetiwelding.com">office@yetiwelding.com</a></div>
                <div>Phone: <a className="underline" href="tel:+18109958906">+1 (810) 995-8906</a></div>
                <div className="mt-1">Ship-From: Springville, UT City, UT</div>
              </div>
            </div>

            <FAQMini />
          </div>
        </div>
      </div>
    </Layout>
  );
}
