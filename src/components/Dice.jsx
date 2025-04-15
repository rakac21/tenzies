import React from "react"

export default function Dice(props) {

    const styles = {
        backgroundColor: props.isHeld ? 'rgb(52, 255, 144)' : 'white',
        boxShadow: props.isHeld ? 'none' : 'rgba(0, 0, 0, 0.35) 0px 5px 10px'
    }

    return (
        <button 
            style={styles} 
            onClick={props.toggleDice}
            disabled={props.gameOver}
        >{props.value}</button>
    )
}