// components/HeroMedia.js
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed hero media with graceful fallbacks.
 * - Uses <video> (muted, autoplay, loop) when allowed.
 * - Falls back to static image if prefers-reduced-motion or video not available.
 * - Adds a dark gradient overlay for text legibility.
 * - Accepts children to render overlayed content (optional).
 *
 * Usage:
 * <div className="relative h-[80vh]">
 *   <HeroMedia imageSrc="/hero.jpg" videoSrc="/hero.mp4" alt="" />
 * </div>
 */
export default function HeroMedia({
  imageSrc,
  videoSrc,                 // optional MP4 path
  alt = "",                 // keep empty if decorative background
  priority = true,
  blurDataURL,              // optional next/image blur
  withOverlay = true,       // show gradient overlay for readability
  overlayClassName = "",    // extra classes for overlay (e.g., stronger tint)
  children,                 // optional overlay content
  className = "",           // optional extra classes for media element
}) {
  const [useVideo, setUseVideo] = useState(Boolean(videoSrc));

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // If user prefers reduced motion or no video provided, stick to image.
    if (prefersReduced || !videoSrc) {
      setUseVideo(false);
      return;
    }

    // Lightweight autoplay sanity check using a detached element.
    let cancelled = false;
    (async () => {
      try {
        const test = document.createElement("video");
        test.muted = true;
        test.playsInline = true;
        test.src = videoSrc;
        const p = test.play();
        if (p && typeof p.then === "function") {
          await p.catch(() => {});
        }
        if (!cancelled) setUseVideo(true);
      } catch {
        if (!cancelled) setUseVideo(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  const mediaCommon =
    "absolute inset-0 h-full w-full object-cover " + (className || "");

  return (
    <>
      {useVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={imageSrc}
          className={mediaCommon}
          aria-hidden={alt === "" ? "true" : undefined}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          className={mediaCommon}
          aria-hidden={alt === "" ? "true" : undefined}
        />
      )}

      {/* Gradient overlay for text legibility */}
      {withOverlay && (
        <div
          className={`hero-overlay pointer-events-none ${overlayClassName}`}
          aria-hidden="true"
        />
      )}

      {/* Optional overlay content (centered by default) */}
      {children ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="pointer-events-auto container-7xl px-4 text-center">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
