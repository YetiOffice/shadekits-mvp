import Layout from "../components/Layout";

const COMPANY_NAME = "ShadeKits";
const EFFECTIVE_DATE = "2025-09-22";

export default function TermsPage() {
  return (
    <Layout title={`Terms — ${COMPANY_NAME}`}>
      <div className="container-7xl py-12 prose max-w-3xl">
        <h1>Terms &amp; Conditions</h1>
        <p className="text-sm text-neutral-600">Effective: {EFFECTIVE_DATE}</p>

        <h2>Orders &amp; Payment</h2>
        <p>
          All orders are subject to acceptance. Prices are shown in USD and may change without notice until your order
          is confirmed. Payments are processed securely by third-party providers (e.g., Stripe).
        </p>

        <h2>Lead Time &amp; Shipping</h2>
        <p>
          Typical lead time is 3–5 weeks unless otherwise stated at checkout or in your confirmation email. Shipping is
          curbside delivery within the continental US unless noted. You are responsible for unloading and site access.
        </p>

        <h2>Returns &amp; Cancellations</h2>
        <p>
          Kits are built to order. Orders may be cancelled prior to fabrication for a refund less processing fees.
          After fabrication begins, cancellations and returns are not accepted except where required by law.
        </p>

        <h2>Site Preparation, Permits &amp; Installation</h2>
        <p>
          You are responsible for site preparation, local code compliance, and any required permits. Follow the install
          guide and safety instructions. Use qualified installers where appropriate.
        </p>

        <h2>Warranty</h2>
        <p>
          Materials are warranted against defects in workmanship for a limited period as stated in your documentation.
          Normal wear, improper installation, misuse, and acts of nature are excluded.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {COMPANY_NAME} is not liable for indirect, incidental, or
          consequential damages. Our total liability will not exceed the amount you paid for the product giving rise to
          the claim.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this site—including text, images, models, and designs—is owned by {COMPANY_NAME} or its
          licensors and may not be used without permission.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of your state of operation. Any disputes will be resolved in the courts
          of that jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>Questions? See Support or email us at <a href="mailto:support@shadekits.com">support@shadekits.com</a>.</p>
      </div>
    </Layout>
  );
}
