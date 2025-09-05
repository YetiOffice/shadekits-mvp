// pages/thank-you.js
export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md bg-white border border-neutral-200 rounded-2xl p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Thanks! 🎉</h1>
        <p className="text-neutral-600">
          We received your request. A ShadeKits specialist will reach out shortly with your
          concept and next steps.
        </p>
        <a
          className="inline-block mt-4 px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
          href="/builder"
        >
          Back to Builder
        </a>
      </div>
    </div>
  );
}
