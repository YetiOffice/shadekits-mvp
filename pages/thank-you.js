// pages/thank-you.js
import { useRouter } from "next/router";

export default function ThankYou() {
  const { query } = useRouter();
  const kit = query.kit || "your kit";

  return (
    <div className="container-7xl py-16">
      <h1 className="mb-4">Thank you!</h1>
      <p className="text-lg mb-2">We’ve received your order for <strong>{kit}</strong>.</p>
      <p className="text-neutral-700 mb-6">
        A confirmation has been sent to your email. We’ll follow up to confirm finish, freight,
        and delivery details before fabrication.
      </p>
      <a href="/builder" className="btn btn-secondary">Back to Builder</a>
    </div>
  );
}
