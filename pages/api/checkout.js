// pages/api/checkout.js
import Stripe from "stripe";
import { PRICE_MAP } from "../../data/priceMap";
import { getKitBySlug } from "../../data/standardKits";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env.local");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug, cfg = {} } = req.body || {};

    const kit = getKitBySlug?.(slug);
    if (!kit) return res.status(400).json({ error: "Unknown kit" });

    const priceId = PRICE_MAP?.[slug];
    if (!priceId) {
      return res
        .status(400)
        .json({ error: "No price configured for this kit" });
    }

    // Base URL for redirects
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.origin ||
      `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/thank-you?kit=${encodeURIComponent(
        slug
      )}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/builder?kit=${encodeURIComponent(slug)}`,
      metadata: {
        kit: String(slug),
        ...(cfg.span != null && { span: String(cfg.span) }),
        ...(cfg.depth != null && { depth: String(cfg.depth) }),
        ...(cfg.height != null && { height: String(cfg.height) }),
        ...(cfg.colorId != null && { colorId: String(cfg.colorId) }),
        ...(cfg.roofDesignId != null && {
          roofDesignId: String(cfg.roofDesignId),
        }),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Checkout error" });
  }
}
