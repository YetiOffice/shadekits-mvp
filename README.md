# ShadeKits – MVP Website

A minimal Next.js + Tailwind site to sell bolt‑together outdoor shade structure kits.
Includes: homepage, shop grid, product configurator with live pricing, resources, and contact.

## 1) One‑time setup (free)
- Create a GitHub account
- Create a Vercel account (https://vercel.com)

## 2) Import & deploy
1. Push this repo to your GitHub (or click "New repository" and upload).
2. In Vercel: **Add New → Project → Import Git Repository** → choose your repo.
3. Accept defaults (Framework: Next.js). Click **Deploy**.
4. You’ll get a live preview URL immediately (e.g., https://shadekits.vercel.app).

## 3) Environment variables (so you don’t edit code)
In Vercel → Project → **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_CONTACT_EMAIL=office@yetiwelding.com
NEXT_PUBLIC_CONTACT_PHONE=+18019958906
# Optional: QUOTE_WEBHOOK_URL=https://your-webhook-endpoint.example
```

Click **Redeploy** to apply.

## 4) Connect your domain (optional now)
- In Vercel → Project → **Domains** → add your domain (e.g., shadekits.com).
- Follow the DNS instructions shown by Vercel (usually a CNAME).
- SSL is automatic.

## 5) Edit products & pricing (no dev skills needed)
Open `data/products.js` and adjust:
- `basePrice`
- `footprint`, `clearance`
- Option prices in ROOF/COLOR/HEIGHT/MOUNT/PANELS/ADDONS

Replace placeholder images in `/public` with real renders/photos (same filenames or update paths).

## 6) Test your funnel
- Home → Shop → Product → change options → **Email Quote**.
- Confirm the email opens with selections and total.- Contact page form displays confirmation (no backend yet).

## Local development (optional for power users)
```bash
npm install
npm run dev
# then open http://localhost:3000
```

You can safely ignore local dev and manage everything via Vercel UI.

---

### Roadmap (when ready)
- Swap "mailto" with real email sending (Resend/SendGrid) via /api route.
- Google Sheet logging (Zapier/Make or Google Apps Script).
- Real freight calculator, coupon codes, and checkout.- Renders and installation PDFs.
Questions? Ping your builder (that’s me). We’ll iterate fast.
