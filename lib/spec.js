// lib/spec.js
import { usd } from "./pricing";

export function buildSpec({ form, config, pricing, notes, flags, permalink }) {
  const lines = [];

  lines.push("==== ShadeKits Builder Request ====");
  lines.push("");
  lines.push("Contact");
  lines.push(`• Name: ${form.name || "—"}`);
  lines.push(`• Email: ${form.email || "—"}`);
  lines.push(`• Phone: ${form.phone || "—"}`);
  lines.push(`• City/State: ${form.city || "—"}`);
  lines.push(`• ZIP: ${form.zip || "—"}`);
  lines.push(`• Use case: ${form.useCase || "—"}`);
  lines.push("");

  lines.push("Configuration");
  lines.push(`• Style: ${config.style}`);
  lines.push(`• Size: ${config.span}×${config.depth} ft`);
  lines.push(`• Bays: ${config.bays}`);
  lines.push(`• Height: ${config.height} ft`);
  lines.push(`• Infill: ${config.infill}`);
  lines.push(`• Finish: ${config.finish}`);
  lines.push(`• Anchoring: ${config.anchor}`);
  lines.push("");

  lines.push("Budget");
  lines.push(`• Budget range: ${usd(pricing.budgetLow)}–${usd(pricing.budgetHigh)}`);
  if (pricing.breakdown) {
    lines.push(
      `• Breakdown: frame ${usd(pricing.breakdown.frame)}, infill ${usd(
        pricing.breakdown.infill
      )}, anchoring ${usd(pricing.breakdown.anchoring)}`
    );
    lines.push(`• Posts: ${pricing.breakdown.posts}`);
  }
  lines.push("");

  lines.push("Freight");
  if (pricing.freightLow && pricing.freightHigh) {
    lines.push(`• Freight estimate: ${usd(pricing.freightLow)}–${usd(pricing.freightHigh)}`);
    if (pricing.freightMeta)
      lines.push(`• Zone: ${pricing.freightMeta.zone}, plan area: ${pricing.freightMeta.area} sqft`);
  } else {
    lines.push("• Freight estimate: Entered ZIP was missing—please collect.");
  }
  lines.push("");

  if (notes?.length) {
    lines.push("Notes / Rules");
    notes.forEach((n) => lines.push(`• ${n}`));
    lines.push("");
  }
  if (flags?.engineerReview) {
    lines.push("⚠ Engineering review may be required for this configuration.");
    lines.push("");
  }

  if (permalink) {
    lines.push("Permalink to this concept");
    lines.push(permalink);
    lines.push("");
  }

  lines.push("==== End ====");
  return lines.join("\n");
}
