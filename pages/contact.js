import Layout from '../components/Layout';
import Section from '../components/Section';

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'office@yetiwelding.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+18019958906';

  return (
    <Layout>
      <Section title="Get a Free Quote" className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="text-sm text-neutral-700">
              Send us your project details and we’ll reply fast.
            </div>
            <form
              className="mt-4 grid grid-cols-1 gap-3"
              onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll be in touch."); }}
            >
              <input className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="Name" required />
              <input className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="Email" type="email" required />
              <input className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="Phone" />
              <textarea className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="Tell us about your site (dimensions, pad, timeline)" />
              <div className="flex gap-3">
                <button type="submit" className="rounded-2xl px-4 py-2 bg-black text-white text-sm">Submit</button>
                <a className="text-sm text-neutral-700 flex items-center" href={`tel:${phone}`}>Or call {phone}</a>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="font-semibold">Contact</div>
            <div className="text-sm text-neutral-700 mt-2">
              Email: <a className="underline" href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="text-sm text-neutral-700">
              Phone: <a className="underline" href={`tel:${phone}`}>{phone}</a>
            </div>
            <div className="text-sm text-neutral-700 mt-4">Ship-From: Placeholder City, UT</div>
            <div className="mt-4 w-full h-48 bg-neutral-200 rounded-xl border flex items-center justify-center">
              Map Placeholder
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
