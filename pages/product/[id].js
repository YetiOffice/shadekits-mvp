import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import { CATALOG, ROOF, COLOR, HEIGHT, MOUNT, PANELS, ADDONS } from '../../data/products';

const money = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const product = CATALOG.find(p => p.id === id) || CATALOG[0];

  const [roof, setRoof] = React.useState(ROOF[0].id);
  const [color, setColor] = React.useState(COLOR[0].id);
  const [height, setHeight] = React.useState(10);
  const [mounting, setMounting] = React.useState(MOUNT[0].id);
  const [panels, setPanels] = React.useState(PANELS[0].id);
  const [addOns, setAddOns] = React.useState([]);
  const [qty, setQty] = React.useState(1);

  const getAdj = (opts, id) => (opts.find(o => o.id === id)?.priceAdj || 0);
  const addOnAdj = addOns.map(id => getAdj(ADDONS, id)).reduce((a,b)=>a+b,0);
  const total = (product.basePrice +
    getAdj(ROOF, roof) +
    getAdj(COLOR, color) +
    getAdj(HEIGHT, height) +
    getAdj(MOUNT, mounting) +
    getAdj(PANELS, panels) +
    addOnAdj) * qty;

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'office@yetiwelding.com';
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+18019958906';

  const sendQuote = () => {
    const sel = {
      product: product.name,
      roof: ROOF.find(o => o.id === roof)?.label,
      color: COLOR.find(o => o.id === color)?.label,
      height: HEIGHT.find(o => o.id === height)?.label,
      mounting: MOUNT.find(o => o.id === mounting)?.label,
      panels: PANELS.find(o => o.id === panels)?.label,
      addOns: addOns.map(id => ADDONS.find(o => o.id === id)?.label),
      quantity: qty,
      estTotal: money(total),
    };
    const subject = encodeURIComponent(`[Quote Request] ${product.name}`);
    const body = encodeURIComponent(
`Name:
Company:
Phone: ${contactPhone}
Email: ${contactEmail}

Product: ${sel.product}
Roof: ${sel.roof}
Color: ${sel.color}
Height: ${sel.height}
Mounting: ${sel.mounting}
Side Panels: ${sel.panels}
Add-Ons: ${sel.addOns.join(', ') || 'None'}
Quantity: ${sel.quantity}

Estimated Total: ${sel.estTotal}

Ship-to City/State:
Notes: `);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const Select = ({ label, value, onChange, options }) => (
    <label className="block mb-4">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(isNaN(options[0].id) ? e.target.value : Number(e.target.value))}
      >
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.label} {o.priceAdj ? `(${o.priceAdj > 0 ? '+' : ''}${money(o.priceAdj)})` : ''}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <Layout>
      <main className="container-7xl py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="card overflow-hidden">
            <div className="w-full aspect-[16/9] bg-neutral-200 flex items-center justify-center">{product.name}</div>
          </div>

          <div className="card p-6 mt-8">
            <h2 className="text-lg font-semibold mb-2">About this kit</h2>
            <p className="text-neutral-700 leading-relaxed">
              Commercial-grade, bolt-together steel shade kit engineered for outdoor spaces.
              Ships with all hardware and illustrated instructions. Lead time: 3–4 weeks.
              1-year workmanship + finish warranty. 30-day returns (unused; buyer pays return freight).
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[['Footprint', product.footprint], ['Clearance', product.clearance], ['Frame', 'Powder-coated steel']].map((s, i) => (
                <div key={i} className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                  <div className="text-xs uppercase tracking-wide text-neutral-500">{s[0]}</div>
                  <div className="text-sm font-medium">{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-16 self-start">
          <div className="card p-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-1 text-sm text-neutral-600">Starting at {money(product.basePrice)}</div>

            <div className="h-px bg-neutral-200 my-4" />

            <Select label="Roof Type" value={roof} onChange={setRoof} options={ROOF} />
            <Select label="Frame Color" value={color} onChange={setColor} options={COLOR} />
            <Select label="Clearance Height" value={height} onChange={setHeight} options={HEIGHT} />
            <Select label="Mounting Style" value={mounting} onChange={setMounting} options={MOUNT} />
            <Select label="Side Panels" value={panels} onChange={setPanels} options={PANELS} />

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Add-Ons</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ADDONS.map(o => (
                  <label key={o.id} className={`flex items-center gap-2 rounded-xl border p-2 ${addOns.includes(o.id)?'border-red-600 bg-neutral-50':'border-neutral-300'}`}>
                    <input type="checkbox" checked={addOns.includes(o.id)} onChange={() => toggleAddOn(o.id)} />
                    <span className="text-sm">{o.label}</span>
                    {o.priceAdj !== 0 && (
                      <span className="ml-auto text-xs text-neutral-600">{o.priceAdj>0?'+':''}{money(o.priceAdj)}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Estimated Total</div>
                <div className="text-3xl font-extrabold">{money(total)}</div>
                <div className="text-xs text-neutral-500">Taxes & freight calculated at quote.</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="btn-secondary">Download Summary</button>
                <button onClick={sendQuote} className="btn-primary">Email Quote</button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm font-medium text-gray-700">Quantity</div>
              <input type="number" min={1} value={qty} onChange={(e)=>setQty(Number(e.target.value)||1)} className="input w-20 text-right"/>
            </div>
          </div>
        </aside>
      </main>
    </Layout>
  );
}
