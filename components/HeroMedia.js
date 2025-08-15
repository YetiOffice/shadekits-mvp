// components/HeroMedia.js
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed media for hero sections.
 * - Plays a muted, looping video when allowed.
 * - Falls back to a static image if user prefers reduced motion or no videoSrc.
 */
export default function HeroMedia({
  imageSrc,
  videoSrc, // optional
  alt = "",
  priority = true,
  blurDataURL,
}) {
  const [useVideo, setUseVideo] = useState(Boolean(videoSrc));

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !videoSrc) {
      setUseVideo(false);
      return;
    }

    // Basic autoplay capability check (muted + playsinline generally works)
    // If it fails for any reason, fall back to image.
    let cancelled = false;
    (async () => {
      try {
        const testVid = document.createElement("video");
        testVid.muted = true;
        testVid.playsInline = true;
        testVid.src = videoSrc;
        const playPromise = testVid.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise.catch(() => {});
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
          className="absolute inset-0 w-full h-full object-cover"
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
          className="object-cover"
        />
      )}
    </>
  );
}
