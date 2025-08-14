// hooks/usePricing.js
import { useMemo } from "react";
import { computeBudgetRange, usd } from "../lib/pricing";
import { computeFreightRange } from "../lib/freight";

export default function usePricing(config, zip) {
  return useMemo(() => {
    const budget = computeBudgetRange(config);
    const freight = computeFreightRange(config, zip);

    return {
      budgetLow: budget.low,
      budgetHigh: budget.high,
      budgetUsd: `${usd(budget.low)}–${usd(budget.high)}`,
      freightLow: freight?.low ?? null,
      freightHigh: freight?.high ?? null,
      freightUsd: freight ? `${usd(freight.low)}–${usd(freight.high)}` : "—",
      breakdown: budget.breakdown,
      freightMeta: freight ? { zone: freight.zone, area: freight.area } : null,
    };
  }, [config, zip]);
}
