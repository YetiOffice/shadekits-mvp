// hooks/usePricing.js
import { useMemo } from "react";
import { computePrice, usd } from "../lib/pricing";

export default function usePricing(config, zip) {
  return useMemo(() => {
    const p = computePrice(config, zip);
    const freightUsd =
      zip && String(zip).length >= 5
        ? `${usd(p.freightLow)}–${usd(p.freightHigh)}`
        : "Enter ZIP";
    return { ...p, freightUsd };
  }, [config, zip]);
}

export { usd };
