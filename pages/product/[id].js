// pages/product/[id].js
export async function getServerSideProps(ctx) {
  const { id } = ctx.params || {};

  // Map legacy product slugs → default configuration
  // (add more slugs here if you link to other product pages)
  const map = {
    "patio-pro-10x10":
      "style=Mono&span=10&depth=10&height=10&color=black&roof=palmleaf",
    // "market-pavilion-20x24": "style=Mono&span=20&depth=24&height=10&color=black&roof=palmleaf",
    // "poolside-pavilion-12x12": "style=Mono&span=12&depth=12&height=10&color=black&roof=palmleaf",
  };

  const qs = map[id];

  // If we know the slug, send them to the Configurator with the right defaults.
  if (qs) {
    return {
      redirect: {
        destination: `/configurator?${qs}`,
        permanent: false, // 307
      },
    };
  }

  // Unknown product -> send to Shop (or 404 if you prefer)
  return {
    redirect: {
      destination: "/shop",
      permanent: false,
    },
  };
}

export default function ProductRedirect() {
  // This component never actually renders because we always redirect server-side.
  return null;
}
