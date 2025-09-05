export default function Section({ title, className = '', children }) {
  return (
    <section className={`container-7xl ${className}`}>
      {title ? <h2 className="section-title">{title}</h2> : null}
      {children}
    </section>
  );
}
