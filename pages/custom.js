import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Section from '../components/Section';
import { CATALOG } from '../data/products';

export default function Custom() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'office@yetiwelding.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+18019958906';
  const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || ''; // e.g., "abcdwxyz"
  const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || ''; // e.g., "https://calendly.com/yourname/15min"

  const [status, setStatus] = React.useState('idle'); // idle | submitting | ok | error

  // Build a simple gallery from existing assets
  const gallery = [
    { src: '/hero.jpg', alt: 'Custom canopy concept' },
    ...CATALOG.map(p => ({ src: p.image || '/hero.jpg', alt: p.name })),
  ].slice(0, 6);

  const budget = [
    { size: '10×10', range: '$3k–$5k', notes: 'Base frame, standard height' },
    { size: '12×12', range: '$4k–$7k', notes: 'Base frame, standard height' },
    { size: '20×20', range: '$8k–$12k', notes: 'Base frame, standard height' },
  ];
  const adders = [
    'Extra clearance height',
    'Side panels / slats',
    'Premium powder coat',
    'PE-stamped drawings',
    'Freight (by region)',
  ];

  const mailtoFallback = (form) => {
    const data = new FormData(form);
    const body =
`Name: ${data.get('name')}
Company: ${data.get('company') || ''}
Email: ${data.get('email')}
Phone: ${data.get('phone') || ''}
City/State: ${data.get('citystate') || ''}

Use Case: ${data.get('usecase') || ''}
Dimensions: ${data.get('dimensions') || ''}
Mounting: ${data.get('mounting') || ''}
Wind/Snow Zone: ${data.get('zone') || ''}
Timeline: ${data.get('timeline') || ''}
Budget: ${data.get('budget') || ''}

Notes:
${data.get('notes') || ''}

(Files were selected in the form. Please attach them when replying to this email.)`;

    const subject = encodeURIComponent('[Custom Inquiry] ShadeKits');
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!FORMSPREE_ID) {
      mailtoFallback(form);
      return;
    }

    try {
      setStatus('submitting');
      const data = new FormData(form);
      // Optional: include a subject for Formspree
      data.append('_subject', '[Custom Inquiry] ShadeKits');

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data, // includes files if selected
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Custom Shade Structures — ShadeKits</title>
        <meta
          name="description"
          content="Engineered, bolt-together steel shade structures customized to your site. Concept to PE-stamped drawings, fabrication, and freight."
        />
      </Head>

      {/* HERO */}
      <section className="container-7xl pt-10">
        <div className="relative card overflow-hidden">
          <div className="aspect-[21/9] bg-neutral-300">
            <img src="/hero.jpg" alt="Custom Shade Structures" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="badge">PE-stamped drawings available</span>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight">Custom Shade Structures</h1>
            <p className="mt-3 max-w-3xl text-neutral-700">
              Engineered, bolt-together steel built for your site. From concept sketch to budgetary price, engineering, fabrication, and freight.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#lead" className="btn-primary">Request a Concept Sketch</a>
              <a href="#lead" className="btn-secondary">Upload Plans</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF / GALLERY */}
      <Section title="Recent Projects" className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[16/9] bg-neutral-200">
                <img src={g.src} alt={g.alt} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section title="How It Works" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Discovery', 'Share site photos, measurements, and goals.'],
            ['Concept & Budget', 'Fast concept sketch and budgetary price.'],
            ['Engineering', 'Connection details and optional PE stamps.'],
            ['Fabrication & Freight', 'Powder-coated steel, hardware, and instructions, shipped.'],
          ].map(([t, d], i) => (
            <div key={i} className="card p-5">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
              <div className="mt-3 font-semibold">{t}</div>
              <div className="text-neutral-700">{d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section title="Capabilities" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['Spans & Layouts', 'Single or multi-bay; typical spans 10–30 ft; modular lengths.'],
            ['Heights & Clearances', '8–14 ft; custom posts and footings per site.'],
            ['Roof Styles', 'Flat, mono-slope, gable; panel or slat infill.'],
            ['Coatings', 'Hot-dip galvanize, powder coat colors, marine options.'],
            ['Ratings', 'Wind and snow load designs per local requirements.'],
            ['Add-Ons', 'Lighting, electrical standoffs, signage, side panels.'],
          ].map(([t, d], i) => (
            <div key={i} className="card p-5">
              <div className="font-semibold">{t}</div>
              <div className="text-neutral-700">{d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* BUDGET RANGES */}
      <Section title="Budgetary Ranges" className="py-6">
        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="text-sm text-neutral-600 mb-3">
              Transparent starting ranges help planning. Exact pricing depends on options, finish, engineering, and freight.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="py-2 pr-4">Footprint</th>
                    <th className="py-2 pr-4">Starting Range</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((row, i) => (
                    <tr key={i} className="border-t border-neutral-200">
                      <td className="py-2 pr-4 font-medium">{row.size}</td>
                      <td className="py-2 pr-4">{row.range}</td>
                      <td className="py-2">{row.notes}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-neutral-200">
                    <td className="py-2 pr-4 font-medium">Common adders</td>
                    <td className="py-2 pr-4" colSpan={2}>
                      {adders.join(', ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-neutral-500 mt-2">Taxes and freight calculated at quote.</div>
          </div>
        </div>
      </Section>

      {/* CASE STUDIES */}
      <Section title="Case Studies" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['Restaurant Patio, NV', 'Needed shade without columns in walkway.', 'Mono-slope, 20 ft span, slab anchors; installed in one day.'],
            ['Municipal Park, UT', 'Snow load and vandal-resistant finish.', 'Gable roof, 12 ft clearance, HDG + powder; stamped drawings.'],
            ['Pool Deck, AZ', 'Heat reduction with airflow.', 'Flat roof with slatted panels; noticeable comfort improvement.'],
          ].map(([title, problem, solution], i) => (
            <div key={i} className="card p-5">
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-neutral-600 mt-1">Problem: {problem}</div>
              <div className="text-sm text-neutral-800 mt-1">Solution: {solution}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="FAQ" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Do I need a permit?', 'Many jurisdictions require one. We can provide drawings and, where required, PE stamps.'],
            ['How long does it take?', 'Typical lead time is 3–4 weeks after approvals; complexity can add time.'],
            ['Who installs?', 'DIY or local contractor. Our kits are bolt-together with illustrated instructions.'],
            ['What is included?', 'Pre-cut steel, hardware, anchors as specified, finish schedule, and install guide.'],
          ].map(([q, a], i) => (
            <div key={i} className="card p-5">
              <div className="font-semibold">{q}</div>
              <div className="text-neutral-700">{a}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* LEAD FORM */}
      <Section className="py-10" title="Tell Us About Your Project">
        <div id="lead" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSubmit} encType="multipart/form-data">
              <input className="input" name="name" placeholder="Name *" required />
              <input className="input" name="email" type="email" placeholder="Email *" required />
              <input className="input" name="company" placeholder="Company" />
              <input className="input" name="phone" placeholder="Phone" />
              <input className="input sm:col-span-2" name="citystate" placeholder="City, State" />
              <input className="input sm:col-span-2" name="usecase" placeholder="Use Case (restaurant, park, pool, etc.)" />
              <input className="input" name="dimensions" placeholder="Approx. Dimensions (L×W×H)" />
              <input className="input" name="mounting" placeholder="Mounting (slab anchors or footings)" />
              <input className="input" name="zone" placeholder="Wind/Snow Zone (if known)" />
              <input className="input" name="timeline" placeholder="Timeline (e.g., 6–8 weeks)" />
              <input className="input" name="budget" placeholder="Budget Range" />
              <textarea className="input sm:col-span-2" name="notes" placeholder="Notes (constraints, photos, links)"></textarea>

              {/* File input (sent to Formspree when configured) */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Files (drawings/photos)</label>
                <input className="input w-full" type="file" name="attachments" multiple />
                {!FORMSPREE_ID && (
                  <div className="text-xs text-neutral-500 mt-1">
                    Tip: After you hit Submit, please attach files in your email reply so we receive drawings/photos.
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-3 mt-2">
                <button type="submit" disabled={status==='submitting'} className="btn-primary">
                  {status==='submitting' ? 'Sending…' : 'Send Details'}
                </button>
                <a href={`tel:${phone}`} className="btn-secondary">Call {phone.replace('+1','')}</a>
                {CALENDLY_URL && (
                  <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="btn-secondary">
                    Book 15-min Consult
                  </a>
                )}
              </div>

              {status === 'ok' && (
                <div className="sm:col-span-2 mt-3 rounded-xl border border-green-300 bg-green-50 p-3 text-sm">
                  Thanks! Your details were sent. We’ll reply shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="sm:col-span-2 mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm">
                  Sorry—something went wrong. Please try again, or email us at <a className="underline" href={`mailto:${email}`}>{email}</a>.
                </div>
              )}
            </form>
          </div>

          <div className="card p-6">
            <div className="font-semibold">What you will get</div>
            <ul className="mt-2 text-neutral-700 text-sm list-disc pl-5 space-y-1">
              <li>Concept sketch and budgetary price</li>
              <li>Option for PE-stamped drawings</li>
              <li>Clear inclusions/exclusions</li>
              <li>Target lead time and freight plan</li>
            </ul>
            <div className="mt-4 font-semibold">Questions?</div>
            <div className="text-sm text-neutral-700">
              Email <a className="underline" href={`mailto:${email}`}>{email}</a> or call <a className="underline" href={`tel:${phone}`}>{phone}</a>.
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
