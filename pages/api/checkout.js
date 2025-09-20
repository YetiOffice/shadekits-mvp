// pages/api/checkout.js
import Stripe from "stripe";
import { PRICE_MAP } from "../../data/priceMap";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

function getOrigin(req) {
  // Prefer explicit env for stability across preview/prod
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  // Robust fallback for Vercel/Proxies
  const proto =
    req.headers["x-forwarded-proto"] ||
    (req.headers.referer?.startsWith("https") ? "https" : "http");
  const host =
    req.headers["x-forwarded-host"] ||
    req.headers.host ||
    "localhost:3000";

  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { slug } = req.body || {};

    if (!slug) {
      return res.status(400).json({ error: "Missing kit slug" });
    }

    const priceId = PRICE_MAP[slug];
    if (!priceId) {
      // Return JSON (not plain text) so front-end can show a friendly message.
      return res.status(400).json({ error: "Unknown kit" });
    }

    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      // Add shipping if you want to collect it up-front:
      // shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/thank-you?kit=${encodeURIComponent(
        slug
      )}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/builder?kit=${encodeURIComponent(slug)}&checkout=cancelled`,
      metadata: { kit_slug: slug },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("checkout error", err);
    return res.status(500).json({ error: "Checkout unavailable" });
  }
}
