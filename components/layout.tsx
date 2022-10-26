import Head from 'next/head'
import styles from "../styles/Layout.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import Link from 'next/link'
export default function Layout({ children }) {
  return (
    <>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/" passHref><Image src="/favicon.ico" alt="Secret Santa" width={50} height={50} /></Link>
            <Link href="/" passHref><p>Home</p></Link>
          </li>
          <li>
            <div>
              <p>About</p>
              <span></span>
            </div>
            <div>
              <p><FontAwesomeIcon icon={faQuestionCircle}/></p>
              <span></span>
            </div>
          </li>
        </ul>
      </nav>
          {children}
        <footer className={styles.footer}>
          <p>created by POP</p>
        </footer>
    </>
  )
}
