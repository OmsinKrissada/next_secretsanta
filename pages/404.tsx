import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import styles from "../styles/Home.module.scss"
export default function Custom404() {
  return (
    <>
    <Head>
      <title>404</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <Image src="/santa-claus.png" alt="404" width={200} height={200} />
      <h1>404 - Page Not Found</h1>
      <Link className={styles.create} href="/" passHref><h3>Go back home</h3></Link>
    </main>
    </>
  )
}
