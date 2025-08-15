// components/Reveal.js
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

  const classes = ["reveal", visible ? "in" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      style={{ transitionDelay: `${Math.max(0, delay)}ms` }}
      className={classes}
    >
      {children}
    </Tag>
  );
}
