import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Robust hero media:
 * - Always shows the image layer.
 * - Tries to play a muted, inline video on top.
 * - Only fades video in after onLoadedData + play() succeeds.
 * - Falls back to the image if reduced motion is on or any error occurs.
 */
export default function HeroMedia({
  imageSrc,
  videoSrc, // optional
  alt = "",
  priority = true,
  blurDataURL,
  fadeMs = 400,
}) {
  const vidRef = useRef(null);
  const [shouldTryVideo, setShouldTryVideo] = useState(Boolean(videoSrc));
  const [videoReady, setVideoReady] = useState(false);

  // Respect reduced motion
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !videoSrc) {
      setShouldTryVideo(false);
    }
  }, [videoSrc]);

  // Attempt to play video when it can load
  useEffect(() => {
    if (!shouldTryVideo) return;

    let canceled = false;
    const v = vidRef.current;
    if (!v) return;

    const onCanPlay = async () => {
      try {
        // Some browsers need a tiny kick to start decoding before play()
        // Also ensure muted + playsInline for autoplay policies
        v.muted = true;
        v.playsInline = true;

        const playAttempt = v.play();
        if (playAttempt && typeof playAttempt.then === "function") {
          await playAttempt;
        }
        if (!canceled) setVideoReady(true);
      } catch {
        if (!canceled) {
          // Fallback: keep image only
          setShouldTryVideo(false);
          setVideoReady(false);
        }
      }
    };

    const onError = () => {
      if (!canceled) {
        setShouldTryVideo(false);
        setVideoReady(false);
      }
    };

    v.addEventListener("loadeddata", onCanPlay, { once: true });
    v.addEventListener("error", onError, { once: true });

    // Safety timeout — if nothing happens, fallback to image
    const t = setTimeout(() => {
      if (!canceled && !videoReady) {
        setShouldTryVideo(false);
        setVideoReady(false);
      }
    }, 2000);

    return () => {
      canceled = true;
      clearTimeout(t);
      v.removeEventListener("loadeddata", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, [shouldTryVideo, videoReady]);

  return (
    <div className="absolute inset-0">
      {/* Base image layer (always visible) */}
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

      {/* Video layer (only drawn if we’re trying video) */}
      {shouldTryVideo && (
        <video
          ref={vidRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={imageSrc}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease`,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
