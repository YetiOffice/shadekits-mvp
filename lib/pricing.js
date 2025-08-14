// Budgetary pricing (± range). Adjust numbers as you get real costs.

export function computePrice(cfg) {
  const { spanFt, depthFt, bays, heightFt, roofStyle, infill, finish, peStamp, zip } = cfg;

  const area = spanFt * depthFt; // sqft footprint

  // Base rate per sqft by roof style
  const rate = { flat: 30, mono: 33, gable: 36 }[roofStyle] || 33;
  let base = area * rate;

  // Multi-bay adder (extra posts/beams)
  const bayAdder = Math.max(0, bays - 1) * 1600;

  // Height adder (baseline 10 ft)
  const heightAdder = Math.max(0, heightFt - 10) * 150;

  // Infill adder
  let infillAdder = 0;
  if (infill?.type === 'slats') {
    const perSqft = { open: 2, medium: 4, tight: 6 }[infill.spacing || 'medium'];
    infillAdder = perSqft * area;
  } else if (infill?.type === 'panels') {
    infillAdder = 10 * area;
  }

  // Reinforcement condition (simple): large spans + infill
  const reinforcement = (spanFt >= 16 && (infill?.type === 'panels' || infill?.spacing === 'tight')) ? 600 : 0;

  // Finish multiplier
  const finishMult = (finish?.base === 'HDG + Powder') ? 1.08 : 1.00;

  // PE stamp adder (budgetary)
  const peAdder = peStamp ? 800 : 0;

  // Subtotal before multipliers
  let subtotal = (base + bayAdder + heightAdder + infillAdder + reinforcement + peAdder) * finishMult;

  // Budget range band
  const min = round50(subtotal * 0.92);
  const max = round50(subtotal * 1.08);

  // Lead time: 3–4 weeks baseline + adders
  let leadMin = 3, leadMax = 4;
  if (finish?.base === 'HDG + Powder') leadMax += 1;
  if (peStamp) leadMax += 1;

  // Freight by ZIP first digit
  const freight = freightRange(zip);

  return {
    base: round50(base),
    breakdown: {
      bayAdder, heightAdder, infillAdder, reinforcement, finishMult, peAdder
    },
    subtotal: round50(subtotal),
    range: { min, max },
    leadWeeks: { min: leadMin, max: leadMax },
    freight
  };
}

function freightRange(zip) {
  const first = (zip || '').toString().trim()[0];
  if (!first) return { min: 700, max: 1100 };
  const n = Number(first);
  if (isNaN(n)) return { min: 700, max: 1100 };
  if (n <= 3) return { min: 600, max: 900 };    // East
  if (n <= 6) return { min: 700, max: 1100 };   // Central
  return { min: 800, max: 1200 };               // West
}

function round50(v) {
  return Math.round(v / 50) * 50;
}
