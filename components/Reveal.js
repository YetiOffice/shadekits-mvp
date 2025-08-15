// components/Reveal.js
import clsx from "clsx";
import useReveal from "../hooks/useReveal";

/**
 * Usage:
 * <Reveal variant="up" delay={120}><div>...</div></Reveal>
 * Variants: "up" | "fade" | "scale"
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  variant = "up",
  delay = 0,
}) {
  const { ref, visible } = useReveal();

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      style={{ transitionDelay: `${Math.max(0, delay)}ms` }}
      className={clsx("reveal", visible && "in", className)}
    >
      {children}
    </Tag>
  );
}
