import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { css } from "@emotion/react"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { ToastContainer, toast } from 'react-toastify';
import PuffLoader from "react-spinners/PuffLoader"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const override = css`
  display: flex;
`;

export default function GameRoom(props) {
  const { players, nickname, socket, resetGame } = props
  const [isIntro, setIsIntro] = useState(true)
  const [isGame, setIsGame] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [previousWord, setPreviousWord] = useState("")
  const [currentWord, setCurrentWord] = useState("")
  const [winner, setWinner] = useState(null)
  const navigate = useNavigate()

  // Set 5 seconds before the game starts
  useEffect(() => {
    // Redirect to mainpage if invalid game
    if (!players || !nickname || !socket) {
      navigate("/")
    }

    setTimeout(() => {
      setIsIntro(false)
      setIsGame(true)
    }, 5000)
  }, [])

  useEffect(() => {
    socket.on("word exists", () => {
      toast.error("This word has already been used!", {
        position: "top-center"
      })
    })

    socket.on("submit word", res => {
      if (res) {
        setPreviousWord(res.word)
        setCurrentTurn(res.round % 2)
        setCurrentWord("")
      }
    })

    socket.on("game end", res => {
      if (res) {
        setIsGame(false)
        setIsEnd(true)
        setWinner(res)
      }
    })
  }, [])

  const submitWord = (e) => {
    e.preventDefault();

    if (previousWord !== "" && currentWord.slice(0,1) !== previousWord.slice(-1)) {
      toast.error("Word must start with the previous word's last letter!")
    } else {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        // API returns an array of correct words if the word is valid otherwise returns an error message
        if (result && result[0]) {
          socket.emit("submit word", currentWord)
        } else {
          toast.error("Invalid word!", {
            position: "top-center"
          })
        }
      })
    }
  }

  const endGame = () => {
    // Emit the game is over and send the winner's name
    socket.emit("game end", players.find(player => player !== nickname))
  }

  const returnToMain = () => {
    socket.emit("leave room")
    resetGame()
    navigate("/")
  }

  return (
    <div className="game-room-container">
      <ToastContainer />
      {
        isIntro ? 
          <React.Fragment>
            <div className="host-container">
              <span className="name-header">{players[0]}</span>
              <span className="host-starts">Starts first!</span>
            </div>
            <div>
              <span className="versus">VS</span>
            </div><div>
              <span className="name-header">{players[1]}</span>
            </div>
          </React.Fragment>
        : isGame ?
          <div className="active-game-container">
            <div className="header-container">
              <span>
                {`Previous word: ${previousWord}`}
              </span>
              <CountdownCircleTimer isPlaying={players[currentTurn] === nickname} duration={30} colors={[['#B47856', 1]]} size={90} onComplete={endGame}>
                {({ remainingTime }) => (players[currentTurn] === nickname ? remainingTime : "")}
              </CountdownCircleTimer>
            </div>
            {
              players[currentTurn] === nickname ? 
                <div className="current-turn">
                  <span>
                    {`Your letter: ${ previousWord ? previousWord.slice(-1) : "" }`}
                  </span>
                  <form onSubmit={e => submitWord(e)}>
                    <input onChange={e => setCurrentWord(e.target.value)}/>
                  </form>
                </div>
                :
                <div className="awaiting-turn">
                  <span>
                    Waiting on Opponent...
                  </span>
                  <PuffLoader color="#B47856" loading={true} css={override} size={400} />
                </div>
            }
          </div>
        :
          <div className="end-game-container">
            <span>{`You ${ winner === nickname ? "Won!" : "Lost" }`}</span>
            <button className="main-button" onClick={returnToMain}>Return</button>
          </div>
      }

    </div>
  )
}