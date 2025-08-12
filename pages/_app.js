import '../styles/globals.css';
import Head from 'next/head';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.variable}>
      <Head>
        <title>ShadeKits — Bolt-Together Steel Shade Structures</title>
        <meta name="theme-color" content="#DC2626" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
