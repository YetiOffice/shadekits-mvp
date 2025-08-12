import Layout from '../components/Layout';
import Section from '../components/Section';

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'office@yetiwelding.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+18019958906';

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks! We will be in touch.');
  };

  return (
    <Layout>
      <Section title="Get a Free Quote" className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="text-sm text-neutral-700">Send us your project details and we will reply fast.</div>
            <form className="mt-4 grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
              <input className="input" placeholder="Name" required/>
              <input className="input" placeholder="Email" type="email" required/>
              <input className="input" placeholder="Phone"/>
              <textarea className="input" placeholder="Tell us about your site (dimensions, pad, timeline)"></textarea>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Submit</button>
                <a className="text-sm text-neutral-700 flex items-center" href={`tel:${phone}`}>Or call {phone}</a>
              </div>
            </form>
          </div>

          <div className="card p-6">
            <div className="font-semibold">Contact</div>
            <div className="text-sm text-neutral-700 mt-2">
              Email: <a className="underline" href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="text-sm text-neutral-700">
              Phone: <a className="underline" href={`tel:${phone}`}>{phone}</a>
            </div>
            <div className="text-sm text-neutral-700 mt-4">Ship-From: Placeholder City, UT</div>
            <div className="mt-4 w-full h-48 bg-neutral-200 rounded-xl border flex items-center justify-center">Map Placeholder</div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
