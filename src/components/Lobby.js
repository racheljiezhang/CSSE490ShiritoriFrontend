import React, { useEffect, useState } from 'react'
import { css } from "@emotion/react"
import PuffLoader from "react-spinners/PuffLoader"
import cx from 'classnames'
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

const override = css`
  display: flex;
`;

export default function Lobby(props) {
  const { players, code, exitLobby, socket, lobbyMessage } = props
  const [ loading, setLoading ] = useState(true);
  const [ opponent, setOpponent ] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to mainpage if invalid game
    if (players.length !== 2 && !code) {
      navigate("/")
    }
  }, [])

  useEffect(() => {
    if (players.length > 1) {
      setOpponent(players[1])
      setTimeout(() => {
        setLoading(false)
      }, 1000)

      setTimeout(() => {
        navigate("/gameroom")
      }, 2000)
    }
  }, [players])

  const exitRoom = () => {
    socket.emit("leave room")
    exitLobby()
    navigate("/")
  }

  return (
    <div className="lobby-container">
      <div className="room-id-container">
        <span>Room ID:</span>
        <span className="code">{code}</span>
      </div>
      <div className="loading-status">
        <span className="status-message">{ opponent ? `${opponent} has joined!` : "Awaiting opponent"}</span>
        <div className={cx({
          'puff-loader-wrapper': true,
          'hidden': !loading
        })}>
          <PuffLoader color="#B47856" loading={loading} css={override} size={150} />
        </div>
      </div>
      <i class="far fa-window-close" onClick={exitRoom}></i>
    </div>
  )
}