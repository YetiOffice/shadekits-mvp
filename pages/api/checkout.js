import { PRICE_MAP } from "../../data/priceMap";
import { getKitBySlug } from "../../data/standardKits";
// … keep other imports like Stripe

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug, cfg } = req.body || {};
    const kit = getKitBySlug(slug);
    if (!kit) {
      return res.status(400).json({ error: "Unknown kit" });
    }
    const priceId = PRICE_MAP[slug];
    if (!priceId) {
      return res.status(400).json({ error: "No price configured for this kit" });
    }

    const origin = req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
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
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Checkout error" });
  }
}
