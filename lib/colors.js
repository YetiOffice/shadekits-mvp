// lib/colors.js
export const COLORS = [
  { id: "black",    name: "Black",    hex: "#0B0B0B" },
  { id: "white",    name: "White",    hex: "#F3F4F6" },
  { id: "bronze",   name: "Bronze",   hex: "#6E5B4B" },
  { id: "charcoal", name: "Charcoal", hex: "#3A3A3A" },
  { id: "sand",     name: "Sand",     hex: "#D4C6AF" },
  { id: "hdg",      name: "HDG",      hex: "#B7BFC6" }
];

export function colorHex(id) {
  const c = COLORS.find(x => x.id === id);
  return c ? c.hex : "#0B0B0B";
}
