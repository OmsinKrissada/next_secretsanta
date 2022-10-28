import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import styles from "../styles/Home.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import Router, { useRouter } from "next/router"
export default function Custom404() {
  const [search, setSearch] = useState("")  
  const router = useRouter()
  const enterRoom = (id:string) => {
    router.push(`/lobby/${id}`)
  }
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
      <div className={styles.input}>
            <input value={search} onKeyDown={(event)=>{event.key==="Enter"? enterRoom(search):{}}} onChange={(e)=>setSearch(e.target.value)}></input>
            <Link href=""><p><FontAwesomeIcon icon={faSearch}/></p></Link>
          </div>
          <p>or</p>
          <div className={styles.create}>
            <Link href=""><h4>Create Room</h4></Link>
          </div>
      <Link className={styles.create} href="/" passHref><h3>Go back home</h3></Link>
    </main>
    </>
  )
}
