import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom';

export default function Leaderboard(props) {
  const [leaderboard, setLeaderboard] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8001/leaderboard")
    .then(res => res.json())
    .then(result => {
      if (result && result.length > 0) {
        setLeaderboard(result)
      }
    })
  }, [])

  return (
    <div className="leaderboard-container">
      <div className="header-container">
        <button className="leaderboard-button" onClick={() => navigate("/")}>Go back</button>
      </div>
      <h1>Leaderboard</h1>
      <div className="leaderboard-headers">
        <span>Players</span>
        <span>Rounds</span>
      </div>
      {/* <div className="leaderboard-data"> */}
        {
          leaderboard.map((round, i) => 
            <div className="leaderboard-data" id={i}>
              <span>{`${i}. `}<span className={round.user0 === round.winner ? "winner" : "loser"}>{round.user0}</span> vs <span className={round.user1 === round.winner ? "winner" : "loser"}>{round.user1}</span></span>
              <span>{round.round}</span>
            </div>
          )
        }
      {/* </div> */}
    </div>
  )
}