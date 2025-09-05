# ShadeKits – Project Notes

**Stack:** Next.js + Tailwind, deployed on Vercel  
**Brand:** Red / White / Black (Inter font)  
**Contact:** office@yetiwelding.com · (801) 995-8906  
**Repo:** shadekits-mvp

## Current Status
- ✅ Live on Vercel
- ✅ Base pages: Home, Shop, Product, Contact, Resources
- ✅ Red/white/black theme, Inter font, favicon
- ✅ Shared UI utilities: `.btn-primary`, `.btn-secondary`, `.input`, `.card`
- ✅ Images in `/public`:  
  - `hero.jpg`  
  - `patio-pro-10x10.jpg`  
  - `pavilion-12x12.jpg`  
  - `cafe-cover-20x20.jpg`
- ✅ Product cards/hero wired to show images
- ⏳ “Custom Work” page to be created

## Environment Variables (Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_CONTACT_EMAIL = office@yetiwelding.com`
- `NEXT_PUBLIC_CONTACT_PHONE = +18019958906`

## Next Session Focus (“Custom Work” page)
1. **Hero + positioning:** “Custom Shade Structures — Engineered for Your Site”
2. **Gallery/Proof:** 6–12 images (renders or installs)
3. **Process strip:** Discovery → Concept & Budget → Engineering → Fabrication & Freight
4. **Capabilities grid:** spans, heights, roof types, coatings, wind/snow ratings, add-ons
5. **3 mini case studies:** problem → constraints → solution → outcome
6. **FAQ:** permits, lead times, PE stamps, install options, warranty
7. **Lead capture:** form with file upload + optional Calendly link

## Nice-to-Haves (after the page)
- Testimonials section on Home
- Basic SEO: titles/meta per page, JSON-LD on Product
- Analytics (Vercel Analytics or GA4)
- Quote logging (Google Sheet or Resend/SendGrid instead of `mailto:`)

## Quick Reference
- Components live in `/components` (e.g., `Layout.js`, `Section.js`)
- Pages live in `/pages`
- Product data in `/data/products.js` (add/adjust pricing and images here)
- Public assets (images, favicon) go in `/public`

## Working Style
- Keep filenames simple; images go in `/public`
- Commit to `main` and trigger a **New Deployment** in Vercel for changes to go live
- When in doubt, ask for “copy-paste version” changes
