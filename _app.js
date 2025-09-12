// pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Nice address bar color on mobile browsers */}
        <meta name="theme-color" content="#E11D48" />
      </Head>
      {/* Expose both font variables to CSS */}
      <div className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
