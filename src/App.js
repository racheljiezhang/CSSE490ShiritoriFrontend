import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import './styles/main.scss';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import Leaderboard from './components/Leaderboard';
import { useNavigate } from 'react-router-dom';

import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:8001/"
const socket = socketIOClient(ENDPOINT)
// const socket = null

function App() {
  const [code, setCode] = useState("")
  const [players, setPlayers] = useState([])
  const [nickname, setNickname] = useState("")
  const [socketsInitialized, setSocketsInitialized] = useState(false)
  const [lobbyMessage, setLobbyMessage] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (socket && !socketsInitialized) {
      setSocketsInitialized(true)

      socket.on("create room", res => {
        if (res) {
          setCode(res)
          navigate("/lobby")
        }
      })
  
      socket.on("join room", res => {
        if (res.status === "Ok") {
          setPlayers(res.name)
          setCode(res.code)
          navigate("/lobby")
        } else {
          setLobbyMessage(res.name)
        }
      })
  
      socket.on("new player", res => {
        // Only emitted on succcess
        console.log("New player event")
        setPlayers(res)
      })
    }
  }, [players])

  const resetGame = () => {
    setCode("")
    setPlayers([])
    setNickname("")
  }

  const exitLobby = () => {
    setCode("")
    setPlayers([])
  }

  const confirmNickname = nickname => {
    setNickname(nickname)
  }

  const testAddPlayer = () => {
    setPlayers(players.push({nickname: "Peter"}))
  }

  return (
    <Routes>
      <Route path="*" element={<MainPage confirmNickname={confirmNickname} nickname={nickname} socket={socket} lobbyMessage={lobbyMessage} />} />
      <Route path="/" element={<MainPage confirmNickname={confirmNickname} nickname={nickname} socket={socket} lobbyMessage={lobbyMessage} />} />
      <Route path="/lobby" element={<Lobby players={players} code={code} socket={socket} testAddPlayer={testAddPlayer} resetGame={resetGame} exitLobby={exitLobby} />} />
      <Route path="/gameRoom" element={<GameRoom players={players} nickname={nickname} socket={socket} resetGame={resetGame} />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}

export default App;
