export default function Section({ title, children, className = '' }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </section>
  )
}
