import React from 'react';
import PreviewSVG from './PreviewSVG';
import { computePrice } from '../../lib/pricing';
import { applyGuardrails } from '../../lib/rules';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || '';
const EMAIL_FALLBACK = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'office@yetiwelding.com';

const SPANS = [10, 12, 16, 20];
const DEPTHS = [10, 12, 16, 20];
const BAYS = [1, 2, 3];
const HEIGHTS = [8, 10, 12];
const ROOFS = [
  { id: 'flat', label: 'Flat' },
  { id: 'mono', label: 'Mono-slope' },
  { id: 'gable', label: 'Gable' },
];
const OVERHANGS = [0, 1, 2];
const FINISH_BASE = ['HDG only', 'HDG + Powder'];
const POWDER_COLORS = ['Black', 'White', 'Graphite', 'Red'];
const INFILL_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'slats', label: 'Slats' },
  { id: 'panels', label: 'Panels' },
];
const SLAT_SPACING = [
  { id: 'open', label: 'Open' },
  { id: 'medium', label: 'Medium' },
  { id: 'tight', label: 'Tight' },
];

export default function Configurator() {
  const [config, setConfig] = React.useState({
    spanFt: 12,
    depthFt: 12,
    bays: 2,
    heightFt: 10,
    roofStyle: 'mono',
    overhangFt: 1,
    infill: { type: 'slats', spacing: 'medium', orientation: 'span' }, // orientation UI omitted for MVP
    finish: { base: 'HDG + Powder', powder: 'Black' },
    anchoring: 'slab', // 'slab' | 'footings'
    zip: '',
    peStamp: false,
  });

  const [user, setUser] = React.useState({
    name: '', email: '', phone: '', cityState: '', usecase: '',
  });

  const [status, setStatus] = React.useState('idle'); // idle | submitting | ok | error
  const { adjusted, warnings } = applyGuardrails(config);
  const price = computePrice(adjusted);

  const update = (patch) => setConfig(prev => ({ ...prev, ...patch }));
  const updateInfill = (patch) => setConfig(prev => ({ ...prev, infill: { ...prev.infill, ...patch }}));
  const updateFinish = (patch) => setConfig(prev => ({ ...prev, finish: { ...prev.finish, ...patch }}));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      user,
      config: adjusted,
      price,
      source: '/configurator'
    };

    if (!FORMSPREE_ID) {
      // Mailto fallback
      const subject = encodeURIComponent('[Configurator] ShadeKits Concept & Price');
      const body = encodeURIComponent(
        `Name: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nCity/State: ${user.cityState}\nUse Case: ${user.usecase}\n\nConfig:\n${JSON.stringify(adjusted, null, 2)}\n\nPrice:\n${JSON.stringify(price, null, 2)}`
      );
      window.location.href = `mailto:${EMAIL_FALLBACK}?subject=${subject}&body=${body}`;
      return;
    }

    try {
      setStatus('submitting');
      const data = new FormData();
      data.append('_subject', '[Configurator] ShadeKits Concept & Price');
      data.append('name', user.name);
      data.append('email', user.email);
      data.append('phone', user.phone);
      data.append('cityState', user.cityState);
      data.append('usecase', user.usecase);
      data.append('config', JSON.stringify(adjusted));
      data.append('price', JSON.stringify(price));

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('ok');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="card p-6 space-y-5">
        {/* Step 1: Footprint & Bays */}
        <div>
          <div className="section-title">Footprint & Bays</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-neutral-600">Span (ft)</label>
              <select className="input w-full" value={config.spanFt} onChange={e => update({ spanFt: parseInt(e.target.value,10) })}>
                {SPANS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-600">Depth (ft)</label>
              <select className="input w-full" value={config.depthFt} onChange={e => update({ depthFt: parseInt(e.target.value,10) })}>
                {DEPTHS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-600">Bays</label>
              <select className="input w-full" value={config.bays} onChange={e => update({ bays: parseInt(e.target.value,10) })}>
                {BAYS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Height & Roof */}
        <div>
          <div className="section-title">Height & Roof</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-neutral-600">Height (ft)</label>
              <select className="input w-full" value={config.heightFt} onChange={e => update({ heightFt: parseInt(e.target.value,10) })}>
                {HEIGHTS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-neutral-600">Roof Style</label>
              <div className="grid grid-cols-3 gap-2">
                {ROOFS.map(r => (
                  <button key={r.id}
                    type="button"
                    onClick={() => update({ roofStyle: r.id })}
                    className={`btn-secondary ${config.roofStyle===r.id ? 'border-red-600' : ''}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label className="text-xs text-neutral-600">Overhang (ft)</label>
            <select className="input w-full" value={config.overhangFt} onChange={e => update({ overhangFt: parseInt(e.target.value,10) })}>
              {OVERHANGS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Step 3: Infill */}
        <div>
          <div className="section-title">Infill</div>
          <div className="grid grid-cols-3 gap-2">
            {INFILL_TYPES.map(t => (
              <button key={t.id} type="button"
                onClick={() => updateInfill({ type: t.id })}
                className={`btn-secondary ${config.infill.type===t.id ? 'border-red-600' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>
          {config.infill.type === 'slats' && (
            <div className="mt-2">
              <label className="text-xs text-neutral-600">Slat Spacing</label>
              <div className="grid grid-cols-3 gap-2">
                {SLAT_SPACING.map(s => (
                  <button key={s.id} type="button"
                    onClick={() => updateInfill({ spacing: s.id })}
                    className={`btn-secondary ${config.infill.spacing===s.id ? 'border-red-600' : ''}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Finish & Anchoring */}
        <div>
          <div className="section-title">Finish & Anchoring</div>
          <div className="grid grid-cols-2 gap-2">
            <select className="input" value={config.finish.base} onChange={e => updateFinish({ base: e.target.value })}>
              {FINISH_BASE.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="input" disabled={config.finish.base!=='HDG + Powder'}
              value={config.finish.powder}
              onChange={e => updateFinish({ powder: e.target.value })}>
              {POWDER_COLORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="input" value={config.anchoring} onChange={e => update({ anchoring: e.target.value })}>
              <option value="slab">Slab anchors</option>
              <option value="footings">New footings</option>
            </select>
            <input className="input" placeholder="ZIP (for freight estimate)" value={config.zip} onChange={e => update({ zip: e.target.value })}/>
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.peStamp} onChange={e => update({ peStamp: e.target.checked })}/>
            PE-stamped drawings recommended for many jurisdictions
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-6">
        <div className="section-title">Live Preview</div>
        <PreviewSVG config={adjusted} />
        {warnings.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
            {warnings.map((w,i)=><div key={i}>• {w}</div>)}
          </div>
        )}
      </div>

      {/* Results & Submit */}
      <div className="card p-6 space-y-4">
        <div className="section-title">Your Estimate</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="card p-4">
            <div className="text-neutral-500">Budget Range</div>
            <div className="text-lg font-bold">${price.range.min.toLocaleString()}–${price.range.max.toLocaleString()}</div>
          </div>
          <div className="card p-4">
            <div className="text-neutral-500">Lead Time</div>
            <div className="text-lg font-bold">{price.leadWeeks.min}–{price.leadWeeks.max} weeks</div>
          </div>
          <div className="card p-4">
            <div className="text-neutral-500">Freight Estimate</div>
            <div className="text-lg font-bold">
              ${price.freight.min.toLocaleString()}–${price.freight.max.toLocaleString()}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-neutral-500">Inclusions</div>
            <div>Pre-cut steel, hardware, anchors (as specified), finish schedule, install guide.</div>
          </div>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2" onSubmit={onSubmit}>
          <input className="input" required placeholder="Name *"
            value={user.name} onChange={e=>setUser({...user, name:e.target.value})}/>
          <input className="input" required type="email" placeholder="Email *"
            value={user.email} onChange={e=>setUser({...user, email:e.target.value})}/>
          <input className="input" placeholder="Phone"
            value={user.phone} onChange={e=>setUser({...user, phone:e.target.value})}/>
          <input className="input" placeholder="City, State"
            value={user.cityState} onChange={e=>setUser({...user, cityState:e.target.value})}/>
          <input className="input sm:col-span-2" placeholder="Use Case (restaurant, park, pool, etc.)"
            value={user.usecase} onChange={e=>setUser({...user, usecase:e.target.value})}/>

          <div className="sm:col-span-2 flex gap-3">
            <button className="btn-primary" disabled={status==='submitting'}>
              {status==='submitting' ? 'Sending…' : 'Request Concept & Price'}
            </button>
            <a className="btn-secondary" href="/custom">Prefer full custom?</a>
          </div>

          {status==='ok' && (
            <div className="sm:col-span-2 mt-2 rounded-xl border border-green-300 bg-green-50 p-3 text-sm">
              Thanks! Your configuration was sent—we’ll reply shortly.
            </div>
          )}
          {status==='error' && (
            <div className="sm:col-span-2 mt-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm">
              Sorry—something went wrong. Please try again or email us at <a className="underline" href={`mailto:${EMAIL_FALLBACK}`}>{EMAIL_FALLBACK}</a>.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
