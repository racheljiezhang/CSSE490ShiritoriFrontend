import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cx from 'classnames'
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

export default function MainPage(props) {
  const { confirmNickname, nickname, socket, lobbyMessage } = props;
  const [ selectedNickname, setSelectedNickname ] = useState(false)
  const [ selectedJoinGame, setSelectedJoinGame ] = useState(false)
  const [ tempNickname, setTempNickname ] = useState("")
  const [ gameCode, setGameCode ] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (nickname) {
      setSelectedNickname(true)
    }
  }, [])

  useEffect(() => {
    if (lobbyMessage) {
      toast.error(lobbyMessage[0], {
        position: "top-center"
      })
    }
  }, [lobbyMessage])

  const submitNickname = (e) => {
    e.preventDefault()
    setSelectedNickname(true)
    confirmNickname(tempNickname)
  }

  const createGame = () => {
    socket.emit("create room", tempNickname)
  }

  const joinGame = (e) => {
    e.preventDefault()
    socket.emit("join room", { name: tempNickname, code: gameCode })
  }

  const exitJoiningLobby = () => {
    setSelectedJoinGame(false)
  }

  const navigateTo = location => {
    navigate(location)
  }

  return (
    <div className="main-page-container">
      <div className="header-container">
        <button className="leaderboard-button" onClick={() => navigateTo("/leaderboard")}>Leaderboard</button>
      </div>
      <ToastContainer />
      <div className={cx({
        "intro-container": true,
        "hidden": selectedNickname
      })}>
        <span className="title">Something to do with words</span>
        <form className="nickname-container" onSubmit={submitNickname}>
          <span>Choose a nickname</span>
          <input onChange={e => setTempNickname(e.target.value)} placeholder="Nickname" value={tempNickname}></input>
          <button className="main-button" type="submit">Confirm</button>
        </form>
      </div>
      <div className={cx({
        "menu-container": true,
        "display": selectedNickname
      })}>
        <span className="welcome-message">{`Welcome ${nickname}`}</span>
        <button className={cx({"hidden": selectedJoinGame, "main-button lg-button": true})} onClick={createGame}>Create Game</button>
        <button className={cx({"active": selectedJoinGame, "main-button lg-button": true})} onClick={() => setSelectedJoinGame(true)}>Join Game</button>
        <form className={cx({"hidden": !selectedJoinGame, "active": selectedJoinGame, "join-lobby-form": true})} onSubmit={e => joinGame(e)}>
          <input onChange={e => setGameCode(e.target.value)}/>       
          <i className="far fa-window-close" onClick={exitJoiningLobby}></i>
        </form>
      </div>
    </div>
  )
}