// pages/product/[id].js
// Redirect product slugs to the builder with matching defaults.

export async function getServerSideProps(ctx) {
  const { id } = ctx.params || {};

  const map = {
    "patio-pro-12x12": "style=Mono&span=12&depth=12&height=10&color=black&roof=palmleaf",
    "patio-pro-12x16": "style=Mono&span=12&depth=16&height=10&color=black&roof=palmleaf",
    "patio-pro-12x20": "style=Mono&span=12&depth=20&height=10&color=black&roof=palmleaf",
  };

  const qs = map[id];
  if (qs) {
    return {
      redirect: {
        destination: `/builder?${qs}&kit=${encodeURIComponent(id)}`,
        permanent: false,
      },
    };
  }

  // Unknown product -> send to Shop (or 404 if you prefer)
  return {
    redirect: { destination: "/shop", permanent: false },
  };
}

export default function ProductRedirect() {
  return null;
}
