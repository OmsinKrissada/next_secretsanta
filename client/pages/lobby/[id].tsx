import { GetServerSideProps } from "next";
import styles from "../../styles/Lobby.module.scss";
import Layout from "../../components/layout";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { use, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faGift } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import EVENTS from "../../config/events";
import { useSockets } from "../../context/socket.context";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

export default function Lobby(props) {
  const { id } = props;
  const router = useRouter();
  const { socket, lobbyId, players } = useSockets();

  let username: string;
  useEffect(() => {
    console.log(`Socket Id: ${socket.id}`);
    username = sessionStorage.getItem('username');
    if (!username) {
      console.log('Username not found in sessionstorage, redirecting');
      router.push('/');
      return;
    }

    console.log(`joining (key: ${router.query.id}, username: ${username})`);
    socket.emit(EVENTS.CLIENT.JOIN_LOBBY, { lobbyId: router.query.id, username });

    socket.on(EVENTS.SERVER.LOBBY_NOT_FOUND, id => {
      console.log(`Lobby not found: ${id}`);
      router.push('/');
    });

    socket.on(EVENTS.SERVER.ROOM_PLAYER, (players) => {
      console.log('Player joining:');
      console.log(players);
    });
  }, []);

  if (!lobbyId) {
    console.log(lobbyId);
    // router.push(`/lobby/404`);
  }


  return (
    <>
      <Head>
        <title>Secret Santa:{id}</title>
      </Head>
      <Layout>
        <main className={styles.main}>
          <div>

            <div className={styles.room_info}>
              <h1>Room: {props.id}</h1>
              <ul>
                {/* <li className={styles.ur}>
                  <h3>
                    <FontAwesomeIcon icon={faGift} /> {username}
                  </h3>
                </li> */}
                {players.map((item) => (
                  <li key={item.name}>
                    <h3>
                      {item.isHost ?
                        (<><FontAwesomeIcon icon={faCrown} /> {item.name}</>) :
                        (<><FontAwesomeIcon icon={faGift} /> {item.name}</>)
                      }
                    </h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.display}>
            <Image
              src="/christmas-tree.png"
              alt="Secret Santa"
              width={200}
              height={200}
              priority
            />
          </div>
          <div className={styles.button}>
            <h3 style={{ margin: "1rem" }}>Player: {players.length}</h3>
            <p>Your name: {username}</p>
            {players.length < 2 ? (
              <p>{3 - players.length} more player to start</p>
            ) : (
              <p></p>
            )}
            <button>start</button>
          </div>
        </main>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;
  // const {socket, lobbyId, username, players} = useSockets();
  let user = [];
  return {
    props: {
      id
    }, // will be passed to the page component as props
  };
};
