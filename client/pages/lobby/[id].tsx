import { GetServerSideProps } from "next"
import styles from "../../styles/Lobby.module.scss"
import Layout from "../../components/layout"
import Head from "next/head"
import Image from "next/image"
import Router from "next/router"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGift } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"
import io from "socket.io-client"
let socket;
export default function Lobby(props) {
  const { id } = props
  const { info } = props
  const [name, setName] = useState('')
  useEffect(() => {
    socketInitializer();
    return () => {
      console.log("This will be logged on unmount");
    }
  })

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {setName(msg)})
  }
  const onChangeHandler = (e) => {
    setName(e.target.value)
    socket.emit('input-change', e.target.value)
  }
  return (
    <>
    <Head>
      <title>Secret Santa:{props.id}</title>
    </Head>
    <Layout>
      <main className={styles.main}>
      <input
      placeholder="Type something"
      value={name}
      onChange={onChangeHandler}
    />
        <div>
          <div className={styles.room_info}>
            <h1>Room: {props.id}</h1>
            <ul>
              {
                info.user.map((item,index)=>(
                  <li key={index}>
                    <h3><FontAwesomeIcon icon={faGift}/> {item}</h3>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className={styles.display}>
          <Image src="/christmas-tree.png" alt="Secret Santa" width={200} height={200} />
        </div>
        <div className={styles.button}>
          <h3 style={{margin:"1rem"}}>Player: {info.user.length}</h3>
          {
            info.user.length<2?<p>need at least 3 player to start</p>:<p>press start to know your Secret santa</p>
          }
          <button>start</button>
        </div>
      </main>
    </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const id = context.params.id
  let user = []
  for(let i = 0; i < 10; i++){
    user.push(`Player ${i}`)
  }
  return {
    props: {
      id,
      info:{
        user: user
      }
    }, // will be passed to the page component as props
  }
}
