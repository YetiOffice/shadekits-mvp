// data/catalog.js

// --------- Product Styles ----------
export const STYLES = [
  { id: "Mono",          label: "Freestanding Mono" },
  { id: "Gable",         label: "Freestanding Gable" },
  { id: "AttachedMono",  label: "Attached Mono" },
];

// --------- Finishes ----------
export const FINISHES = [
  { id: "HDG",   label: "HDG" },
  { id: "Black", label: "Black" },
  { id: "White", label: "White" },
  { id: "Bronze",label: "Bronze" },
];

// --------- Infill options (if present in your original file) ---------
// ... (unchanged)

// --------- Heights (ft) ----------
export const HEIGHTS = [8, 10, 12];

// --------- Size presets (ft) ----------
export const SIZE_PRESETS = [
  { span: 12, depth: 12 },
  { span: 12, depth: 16 },
  { span: 12, depth: 20 },
];

// --------- Hard limits (ft) ----------
export const LIMITS = {
  minSpan: 8,
  maxSpan: 24,
  minDepth: 8,
  maxDepth: 30,
};

// Which finishes/infill are allowed per style (future-proofing)
export const AVAILABILITY = {
  Mono:         { finishes: FINISHES.map(f => f.id), infill: INFILL.map(i => i.id) },
  Gable:        { finishes: FINISHES.map(f => f.id), infill: INFILL.map(i => i.id) },
  AttachedMono: { finishes: FINISHES.map(f => f.id), infill: INFILL.map(i => i.id) },
};
