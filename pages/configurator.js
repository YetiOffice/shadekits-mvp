import Head from 'next/head';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Configurator from '../components/Configurator/Configurator';

export default function ConfiguratorPage() {
  return (
    <Layout>
      <Head>
        <title>Build Your Own — ShadeKits</title>
        <meta name="description" content="Design a steel pergola or custom steel shade kit. Live preview, instant budget, and fast concept & price." />
      </Head>

      {/* HERO */}
      <section className="container-7xl pt-10">
        <div className="relative card overflow-hidden">
          <div className="aspect-[21/9] bg-neutral-300">
            <img src="/hero.jpg" alt="Steel shade structure" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="badge">PE-stamped drawings available</span>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight">Build Your Own</h1>
            <p className="mt-3 max-w-3xl text-neutral-700">
              Choose size, roof, and finish. See a live preview and instant budget range. One click to get your concept & price.
            </p>
            <a href="#build" className="btn-primary mt-6">Start Building</a>
          </div>
        </div>
      </section>

      {/* CONFIGURATOR */}
      <Section id="build" title="Design Your Structure" className="py-8">
        <Configurator />
      </Section>
    </Layout>
  );
}
