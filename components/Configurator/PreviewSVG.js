import React from 'react';

// Simple, fast SVG preview (front elevation-ish). Scales to keep things legible.
export default function PreviewSVG({ config }) {
  const span = config.spanFt;   // width (X)
  const height = config.heightFt; // clearance
  const depth = config.depthFt; // not shown in elevation; used for slat density & roof thickness scale
  const bays = config.bays;
  const overhang = config.overhangFt;
  const infill = config.infill || { type: 'none' };
  const isPowder = config.finish?.base === 'HDG + Powder';
  const powder = config.finish?.powder || 'Black';

  const scale = 12; // pixels per foot
  const pad = 20;
  const totalWft = span + overhang * 2;
  const roofThickness = Math.max(0.2, Math.min(0.5, depth / 40)); // ft -> visual thickness
  const svgW = totalWft * scale + pad * 2;
  const svgH = (height + 3) * scale + pad * 2;

  // Colors
  const frameColor = isPowder ? colorFromPowder(powder) : '#374151'; // graphite-ish for HDG
  const roofColor = isPowder ? colorFromPowder(powder) : '#6b7280';
  const slatStroke = isPowder ? '#ffffff' : '#e5e7eb';

  // Posts layout (bays -> posts)
  // For elevation: posts along width only
  const posts = [];
  const postsCount = bays + 1;
  for (let i = 0; i < postsCount; i++) {
    const xft = (overhang + (span * (i / (postsCount - 1))));
    posts.push({ x: pad + xft * scale, y: pad + height * scale, h: height * scale });
  }

  // Slat density lines
  const slatLines = [];
  if (infill.type === 'slats') {
    const spacingFt = { open: 1.6, medium: 1.0, tight: 0.6 }[infill.spacing || 'medium'];
    const count = Math.max(3, Math.floor(span / spacingFt));
    for (let i = 0; i < count; i++) {
      const x = pad + (overhang + (span * (i / (count - 1)))) * scale;
      slatLines.push(x);
    }
  }

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} role="img" aria-label="Configurator preview">
      {/* background */}
      <rect x="0" y="0" width={svgW} height={svgH} rx="16" fill="#f3f4f6" />

      {/* roof */}
      <rect
        x={pad}
        y={pad + (height - 0.3) * scale - roofThickness * scale}
        width={totalWft * scale}
        height={roofThickness * scale}
        fill={roofColor}
        rx="6"
      />

      {/* slats (as strokes across roof width) */}
      {infill.type === 'slats' && slatLines.map((x, i) => (
        <line key={i} x1={x} x2={x} y1={pad + (height - 0.3) * scale - roofThickness * scale}
          y2={pad + (height - 0.3) * scale}
          stroke={slatStroke} strokeWidth="2" opacity="0.6" />
      ))}

      {/* posts */}
      {posts.map((p, i) => (
        <rect key={i}
          x={p.x - 6} y={p.y - p.h}
          width="12" height={p.h}
          rx="4" fill={frameColor} />
      ))}

      {/* beam */}
      <rect
        x={pad} y={pad + (height - 0.3) * scale}
        width={totalWft * scale}
        height={6}
        rx="3" fill={frameColor}
      />

      {/* labels */}
      <text x={pad} y={svgH - pad} fontSize="12" fill="#6b7280">
        {config.roofStyle.toUpperCase()} · {span}×{depth} ft · {bays} bay{bays>1?'s':''} · {height} ft clr
      </text>
    </svg>
  );
}

function colorFromPowder(name) {
  switch (name) {
    case 'White': return '#ffffff';
    case 'Graphite': return '#374151';
    case 'Red': return '#dc2626';
    case 'Black':
    default: return '#111827';
  }
}
