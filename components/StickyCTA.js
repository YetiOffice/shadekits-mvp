// components/StickyCTA.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA({ threshold = 500 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div
      aria-hidden={!show}
      className={[
        "fixed right-4 bottom-4 z-50 transition-all",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      ].join(" ")}
    >
      <Link
        href="/builder"
        className="shadow-lg hover:shadow-xl transition-shadow
                   rounded-full px-5 py-3 bg-red-600 text-white font-semibold"
      >
        Start Building
      </Link>
    </div>
  );
}
