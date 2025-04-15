import { nanoid } from 'nanoid'
import React from "react"
import Dice from "./components/Dice"
import ReactConfetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

export default function App() {

  const [rolls, setRolls] = React.useState(0)
  
  let {
    hours,
    minutes, 
    seconds,
    pause,
    start,
    reset
  } = useStopwatch({ autoStart: false, interval: 1000 });

  hours = ("00"+hours).substring(hours.toString().length)
  minutes = ("00"+minutes).substring(minutes.toString().length)
  seconds = ("00"+seconds).substring(seconds.toString().length)

  const buttonRef = React.useRef(null)

  const diceRef = React.useRef(null)

  const [dice, setDice] = React.useState(() => generateDices()) 
  // callback da se ne poziva sa svakim renderom

  const gameOver = dice.every(item => item.isHeld === true && 
    item.value === dice[0].value) // zasto ne more useEffect?

  const [gameStart,setGameStart] = React.useState(false)

  React.useEffect(() => {
    if(!gameStart)
      pause()
  },[gameStart])

  React.useEffect(() => {
    if(gameStart)
      start()
  },[gameStart])

  React.useEffect(() => {
    if(gameOver)
    {
      buttonRef.current.focus()
      pause()
    }
  },[gameOver])
  
  function generateDices() {

    let arr = []
    for(let i = 0; i < 10; i++)
      arr.push({
        value: Math.ceil(Math.random()*6),
        isHeld: false,
        id: nanoid()
      }
    )
    return arr
  }

  function toggleDice(diceId) {
    if(!gameStart) setGameStart(true)
    setDice(prev => prev.map(item => {
      return item.id === diceId ? 
      { 
        ...item,
        isHeld: !item.isHeld
      } : { ...item }
    }))
  }

  function rollDices() {
    if(!gameStart) setGameStart(true)
    if(!gameOver)
    {
      setRolls(prev => prev + 1)
      setDice(prev => prev.map(item => {
        return item.isHeld === false ? 
        { 
          ...item,
          value: Math.ceil(Math.random()*6)
        } : { ...item }
      }))
    }
    else
    {
      setDice(generateDices())
      setRolls(0)
      reset()
      setGameStart(false)
    }
  } 
  
  const diceElements = dice.map(item =>
   <Dice 
    ref={diceRef}
    key={item.id} 
    value={item.value} 
    isHeld={item.isHeld}
    toggleDice={() => toggleDice(item.id)}
    id={item.id}
    gameOver={gameOver}/>)

  console.log(gameStart)

  return(
    <main>
      {gameOver && <ReactConfetti />}
      {/* <div aria-live="polite">
        {gameOver && <p className='sr-only'>Congratulations, you won! Press "New game" to play again.</p>}
      </div> */}
      <h1>Tenzies</h1>
      <p>Roll until all dice are the same. Click each dice to freeze it at its current value between rolls</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <div className='buttons'>
        <button
          ref={buttonRef}
          className="roll-dices-button" 
          onClick={rollDices}
          >{gameOver ? "New game" : "Roll"}</button>
        </div>
      <p className='footer'><span className='counter'>Rolls: {rolls}</span><span className='stopwatch'>{hours}:{minutes}:{seconds}</span></p>
    </main>
  )
}