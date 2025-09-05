// pages/api/checkout.js
import Stripe from "stripe";
import { computePrice } from "../../lib/pricing";
import { getKitBySlug, isConfigEqual } from "../../data/standardKits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  console.log("[checkout] kit-mode handler loaded");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("[checkout] request", req.method, req.url);
    const { slug, cfg } = req.body || {};
    console.log("[checkout] body:", { slug, cfg });

    const kit = getKitBySlug(slug);
    if (!kit) {
      console.log("[checkout] unknown kit");
      return res.status(400).json({ error: "Unknown kit" });
    }

    if (!isConfigEqual(kit.config, cfg)) {
      console.log("[checkout] config mismatch");
      return res.status(400).json({ error: "Configuration is not buy-eligible" });
    }

    // Price: use your pricing engine; fallback to 0 if it returns nothing.
    const legacy = {
      style: "Mono",
      span: cfg.span,
      depth: cfg.depth,
      height: cfg.height,
      infill: "None",
      finish: "Black",
      anchor: "Slab",
      bays: 1,
    };
    const price = computePrice(legacy, "")?.budgetHigh || 0;
    const unitAmount = Math.max(0, Math.round(price * 100)); // cents

    const origin =
      req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: kit.name,
              description:
                `${kit.name} — Standard Kit\n` +
                `Size: ${cfg.span}×${cfg.depth}×${cfg.height} ft\n` +
                `Color: ${cfg.colorId}, Roof: ${cfg.roofDesignId}\n\n` +
                `Note: Freight & engineering verification billed/confirmed separately.`,
            },
          },
        },
      ],
      success_url: `${origin}/thank-you?kit=${slug}`,
      cancel_url: `${origin}/builder?kit=${slug}`,
      metadata: {
        slug,
        span: String(cfg.span),
        depth: String(cfg.depth),
        height: String(cfg.height),
        colorId: String(cfg.colorId),
        roofDesignId: String(cfg.roofDesignId),
      },
    });

    console.log("[checkout] session created:", session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Checkout error" });
  }
}
