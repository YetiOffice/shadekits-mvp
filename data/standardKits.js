// /data/standardKits.js
// Whitelist of kits that can be purchased directly (no quote flow).
// Keep values aligned with Configurator's cfg shape.

export const STANDARD_KITS = [
  {
    slug: "patio-pro-10x10",
    name: "Patio Pro 10×10",
    config: {
      span: 10,        // width (ft)
      depth: 10,       // depth (ft)
      height: 10,      // clearance height (ft)
      colorId: "black",
      roofDesignId: "palmleaf", // or whatever default you want
    },
    leadWeeks: [3, 5],
  },
  {
    slug: "poolside-pavilion-12x12",
    name: "Poolside Pavilion 12×12",
    config: {
      span: 12,
      depth: 12,
      height: 10,
      colorId: "black",
      roofDesignId: "palmleaf",
    },
    leadWeeks: [3, 5],
  },
  {
    slug: "cafe-cover-20x20",
    name: "Café Cover 20×20",
    config: {
      span: 20,
      depth: 20,
      height: 10,
      colorId: "black",
      roofDesignId: "palmleaf",
    },
    leadWeeks: [3, 5],
  },
];

// Helper: get by slug
export function getKitBySlug(slug) {
  return STANDARD_KITS.find((k) => k.slug === slug);
}

// Helper: find a kit whose config matches the given cfg (exact, tolerant)
export function findMatchingKit(cfg) {
  return STANDARD_KITS.find((k) => isConfigEqual(k.config, cfg)) || null;
}

// Tolerant comparison: treat ft == ft and ignore tiny float noise.
function isClose(a, b) {
  return Math.abs((a ?? 0) - (b ?? 0)) < 1e-3;
}

// Only compare keys the kits define.
export function isConfigEqual(a, b) {
  if (!a || !b) return false;
  return (
    isClose(a.span, b.span) &&
    isClose(a.depth, b.depth) &&
    isClose(a.height, b.height) &&
    String(a.colorId || "") === String(b.colorId || "") &&
    String(a.roofDesignId || "") === String(b.roofDesignId || "")
  );
}
