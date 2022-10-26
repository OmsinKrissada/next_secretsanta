import type { AppProps } from 'next/app'
import '../styles/globals.scss'
import "@fortawesome/fontawesome-svg-core/styles.css";
import NextNProgress from "nextjs-progressbar"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress color="#bc4749"/>
      <Component {...pageProps} />
    </>
  )
}
