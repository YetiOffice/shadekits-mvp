export const CATALOG = [
  { id: "patio-pro-10x10", name: "Patio Pro 10×10", basePrice: 2950, footprint: "10 ft × 10 ft", clearance: "8–10 ft options", image: "/Patio+Pro+10x10.txt" },
  { id: "poolside-pavilion-12x12", name: "Poolside Pavilion 12×12", basePrice: 3800, footprint: "12 ft × 12 ft", clearance: "9–10 ft options", image: "/Poolside+Pavilion+12x12.txt" },
  { id: "cafe-cover-20x20", name: "Café Cover 20×20", basePrice: 8900, footprint: "20 ft × 20 ft", clearance: "10–12 ft options", image: "/Cafe+Cover+20x20.txt" },
  { id: "market-pavilion-20x24", name: "Market Pavilion 20×24", basePrice: 11500, footprint: "20 ft × 24 ft", clearance: "10–12 ft options", image: "/Market+Pavilion+20x24.txt" },
  { id: "grand-pavilion-24x30", name: "Grand Pavilion 24×30", basePrice: 18900, footprint: "24 ft × 30 ft", clearance: "10–12 ft options", image: "/Grand+Pavilion+24x30.txt" },
]

export const ROOF = [
  { id: "corrugated", label: "Corrugated Steel", priceAdj: 0 },
  { id: "poly", label: "Polycarbonate Panels", priceAdj: -300 },
  { id: "sail", label: "Shade Sail Fabric", priceAdj: -800 },
  { id: "louvered", label: "Louvered Steel (Premium)", priceAdj: 2400 },
]

export const COLOR = [
  { id: "black", label: "Black (Standard)", priceAdj: 0 },
  { id: "charcoal", label: "Charcoal (Standard)", priceAdj: 0 },
  { id: "bronze", label: "Bronze (Standard)", priceAdj: 0 },
  { id: "white", label: "White (Standard)", priceAdj: 0 },
  { id: "ral", label: "Custom RAL (Premium)", priceAdj: 450 },
]

export const HEIGHT = [
  { id: 8, label: "8 ft", priceAdj: -100 },
  { id: 9, label: "9 ft", priceAdj: 0 },
  { id: 10, label: "10 ft", priceAdj: 120 },
  { id: 11, label: "11 ft", priceAdj: 240 },
  { id: 12, label: "12 ft", priceAdj: 360 },
]

export const MOUNT = [
  { id: "concrete", label: "Concrete Anchor Plates", priceAdj: 0 },
  { id: "surface", label: "Surface‑Mount Base Plates", priceAdj: 120 },
  { id: "inground", label: "In‑Ground Post Mount", priceAdj: 280 },
]

export const PANELS = [
  { id: "none", label: "No Side Panels", priceAdj: 0 },
  { id: "privacy", label: "Decorative Privacy Screens", priceAdj: 550 },
  { id: "wind", label: "Solid Windbreak Panels", priceAdj: 780 },
  { id: "curtain", label: "Removable Fabric Curtains", priceAdj: 420 },
]

export const ADDONS = [
  { id: "led", label: "LED Lighting Kit", priceAdj: 260 },
  { id: "fan", label: "Ceiling Fan Mount Kit", priceAdj: 180 },
  { id: "sign", label: "Signage Mount", priceAdj: 95 },
  { id: "anchors", label: "Extra Anchoring Kit (High‑Wind)", priceAdj: 160 },
]
