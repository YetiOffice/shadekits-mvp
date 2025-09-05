// Guardrails keep selections buildable and set expectations.

export function applyGuardrails(cfg) {
  const warnings = [];
  let adjusted = { ...cfg };

  // Overhang max = 10% of span (both sides combined)
  const maxOverhang = Math.floor(adjusted.spanFt * 0.1);
  if (adjusted.overhangFt * 2 > maxOverhang) {
    adjusted.overhangFt = Math.max(0, Math.floor(maxOverhang / 2));
    warnings.push('Overhang reduced to stay within recommended limits.');
  }

  // Span/height interaction
  if (adjusted.spanFt >= 20 && adjusted.heightFt > 12) {
    adjusted.heightFt = 12;
    warnings.push('Height limited to 12 ft for spans ≥ 20 ft (add center post or upgrade required).');
  }

  // Infill constraints at larger spans
  if (adjusted.spanFt >= 16 && adjusted.infill?.type === 'slats' && adjusted.infill.spacing === 'tight') {
    warnings.push('Tight slat spacing at large spans may require reinforcement (included in estimate).');
  }
  if (adjusted.spanFt >= 16 && adjusted.infill?.type === 'panels') {
    warnings.push('Solid panels at large spans may require reinforcement (included in estimate).');
  }

  // Roof style hint
  if (adjusted.spanFt > 20 && adjusted.roofStyle === 'flat') {
    adjusted.roofStyle = 'mono';
    warnings.push('Flat roofs not recommended beyond 20 ft span; switched to mono-slope.');
  }

  return { adjusted, warnings };
}
