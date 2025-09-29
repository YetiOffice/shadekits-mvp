import Layout from "../components/Layout";

const COMPANY_NAME = "ShadeKits";
const EFFECTIVE_DATE = "2025-09-22";

export default function PrivacyPage() {
  return (
    <Layout title={`Privacy — ${COMPANY_NAME}`}>
      <div className="container-7xl py-12 prose max-w-3xl">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-neutral-600">Effective: {EFFECTIVE_DATE}</p>

        <h2>What We Collect</h2>
        <ul>
          <li>Contact details (name, email, phone) you submit.</li>
          <li>Order and payment details processed by our provider (e.g., Stripe).</li>
          <li>Basic usage data (cookies/analytics) to improve site performance.</li>
        </ul>

        <h2>How We Use Data</h2>
        <ul>
          <li>To process orders, provide support, and improve our products and website.</li>
          <li>To communicate important updates related to your order.</li>
        </ul>

        <h2>Payments</h2>
        <p>
          We do not store full payment card numbers. Payments are handled by secure third-party processors (e.g.,
          Stripe). Their use of your data is governed by their privacy policy.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal data. We may share necessary information with service providers (e.g., shipping,
          payment, analytics) to fulfill your order and operate the site.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies and may use analytics cookies to understand site usage. You can control cookies
          through your browser settings.
        </p>

        <h2>Your Choices</h2>
        <p>
          You can request access, correction, or deletion of your personal data, subject to applicable law. Contact us
          at <a href="mailto:support@shadekits.com">support@shadekits.com</a>.
        </p>

        <h2>Data Security</h2>
        <p>
          We use reasonable safeguards to protect personal information. No method of transmission or storage is 100%
          secure.
        </p>

        <h2>Changes</h2>
        <p>We may update this policy. We will post the new date above when changes are made.</p>

        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:support@shadekits.com">support@shadekits.com</a>.</p>
      </div>
    </Layout>
  );
}
