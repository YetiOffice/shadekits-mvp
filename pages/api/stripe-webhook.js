// pages/api/stripe-webhook.js
import Stripe from "stripe";
import { google } from "googleapis";

// Next.js must see the raw body for Stripe signature verification
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function getSheetsClient() {
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!credsJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY missing");
  const credentials = JSON.parse(credsJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

async function appendRowToSheet(row) {
  const spreadsheetId = process.env.GSHEET_ID;
  const range = process.env.SHEET_RANGE || "Sheet1!A:Z";
  const sheets = await getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  let event;
  try {
    const buf = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature verify failed:", err?.message || err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;

    const email =
      s.customer_details?.email ||
      s.customer_email ||
      "";

    const m = s.metadata || {};
    const row = [
      new Date().toISOString(), // Timestamp
      s.id,                     // Stripe Session
      "",                       // ID (leave blank if you want)
      email,                    // Email
      (s.amount_total ?? 0) / 100, // Amount (USD)
      (s.currency || "").toUpperCase(), // Currency
      m.slug || "",             // Kit
      m.span || "",
      m.depth || "",
      m.height || "",
      m.colorId || "",
      m.roofDesignId || "",
    ];

    console.log("[webhook] paid session:", {
      id: s.id,
      amount_total: s.amount_total,
      currency: s.currency,
      email,
      metadata: m,
    });

    try {
      await appendRowToSheet(row);
      console.log("[webhook] sheet append ok");
    } catch (e) {
      console.error("[webhook] sheet append failed:", e?.message || e);
      // We still return 200 so Stripe doesn't retry forever; your logs will show the failure.
    }
  }

  return res.json({ received: true });
}
