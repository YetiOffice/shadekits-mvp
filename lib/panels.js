// lib/panels.js

/**
 * Roof panel catalog
 * - All panels are modeled in inches (plateWidthIn/plateLengthIn/thicknessIn)
 * - Viewer extrudes filled shapes from /public/patterns/*.svg (even-odd fill respected)
 * - Swatch images live under /public/swatches/roof/*.webp
 */

export const ROOF_DESIGNS = [
  {
    id: "palmleaf",
    name: "Palm Leaf",
    svg: "/patterns/palmleaf.svg",                 // 60 × 120 in artboard
    swatch: "/swatches/roof/palmleaf_swatch.webp", // button image

    // real-world panel spec
    plateWidthIn: 60,     // 5 ft
    plateLengthIn: 120,   // 10 ft
    thicknessIn: 0.125,   // 1/8" aluminum
    seamIn: 0.25,         // visual gap between plates in the viewer

    // Alternate every other plate left/right to create a pleasing layout
    mirrorEveryOther: true,

    // (Optional) placeholder for screw layout logic if you add it later
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },

  {
    id: "geocell",
    name: "GeoCell",
    svg: "/patterns/geocell.svg",                    // 60 × 120 in artboard
    swatch: "/swatches/roof/geocell_swatch.webp",

    plateWidthIn: 60,
    plateLengthIn: 120,
    thicknessIn: 0.125,
    seamIn: 0.25,

    // symmetrical; usually no need to mirror
    mirrorEveryOther: false,
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },

  // If you created the stacked 60×60→60×120 panel, add it here.
  // Update the filenames if you saved different names.
  {
    id: "geostar",
    name: "GeoStar",
    svg: "/patterns/geostar.svg",                    // 60 × 120 in artboard (two 60×60 stacked)
    swatch: "/swatches/roof/geostar_swatch.webp",

    plateWidthIn: 60,
    plateLengthIn: 120,
    thicknessIn: 0.125,
    seamIn: 0.25,

    mirrorEveryOther: false,
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },
];

/**
 * Convenience list for UI selectors (id, name, swatch only)
 * Use this if your swatch picker pulls from the catalog.
 */
export const ROOF_SWATCHES = ROOF_DESIGNS.map(({ id, name, swatch }) => ({
  id,
  name,
  swatch,
}));

/**
 * Fetch a design by id; falls back to the first entry.
 */
export function getDesign(id) {
  return ROOF_DESIGNS.find((d) => d.id === id) || ROOF_DESIGNS[0];
}
