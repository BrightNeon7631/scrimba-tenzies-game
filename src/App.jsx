import { 
  useEffect,
  useState 
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dice from './Components/Dice';
import Confetti from 'react-confetti';

function App() {
  const [dice, setDice] = useState(allNewDice);
  const [tenzies, setTenzies] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  useEffect(() => {
    const allDiceHeld = dice.every((die) => {
      return die.isHeld === true;
    })

    const allDiceSameValue = dice.every((die) => {
      return die.value === dice[0].value;
    })

    if (allDiceHeld && allDiceSameValue) {
      setTenzies(true);
    }
  }, [dice])

  useEffect(() => {
    let intervalID;

    if (!tenzies) {
      intervalID = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else { // clean up function neccessary to stop the interval
      clearInterval(intervalID);
    }
    
    return () => {
      clearInterval(intervalID);
    };
  }, [tenzies]);


  function generateDice() {
    return { 
      value: Math.floor(Math.random() * 6) + 1, 
      isHeld: false, 
      id: uuidv4() 
    }
  }

  function allNewDice() {
    const diceArray = [];
    for (let i = 0; i < 10; i++) {
      diceArray.push(generateDice());
    }
    return diceArray;
  }
  
  const diceElements = dice.map((dice) => {
    return (
      <Dice 
        key={dice.id} 
        id={dice.id} 
        value={dice.value} 
        isHeld={dice.isHeld} 
        handleClick={holdDice}
      />
    )
  })

  function holdDice(id) {
    setDice((prevState) => {
      return prevState.map((dice) => {
        return id === dice.id ? {...dice, isHeld: !dice.isHeld} : dice;
      })
    })
  }

  function rollDice() {
    // tenzies !== false -> continue the game
    if (!tenzies) {
      setScore((prevState => prevState + 1));
      setDice((prevState) => {
        return prevState.map((dice) => {
          return dice.isHeld === true ? dice : generateDice();
        })
      })
      // tenzies === true; game over -> reset the game
    } else {
      setDice(allNewDice());
      setTenzies(false);

      if (bestScore !== 0) {
        setBestScore(prevState => {
          return prevState < score ? prevState : score;
        });
      } else {
        setBestScore(score);
      }
      setScore(0);

      if (bestTime !== 0) {
        setBestTime(prevState => {
          return prevState < time ? prevState : time;
        });
      } else {
        setBestTime(time);
      }
      setTime(0);
    }
  }

  return (
    <main>
      <div className="time">
        <div className='time--current'>
          <div>Time: </div>
          <div>
            <span>
              {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
            </span>
            <span>
              {('0' + Math.floor((time / 1000) % 60)).slice(-2)}.
            </span>
            <span>
              {('0' + ((time / 10) % 100)).slice(-2)}
            </span>
          </div>
        </div>
        <div className='time--best'>
          <div>Best time: </div>
          <div>
            <span>
              {('0' + Math.floor((bestTime / 60000) % 60)).slice(-2)}:
            </span>
            <span>
              {('0' + Math.floor((bestTime / 1000) % 60)).slice(-2)}.
            </span>
            <span>
              {('0' + ((bestTime / 10) % 100)).slice(-2)}
            </span>
          </div>
        </div>
      </div>
      <div className="score">
        <div>Score: {score}</div>
        <div>Best score: {bestScore}</div>
      </div>
      <div className="description">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
      </div>
      <div className="dice--container">
        {diceElements}
      </div>
      <button
        onClick={rollDice}
      >
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      {tenzies && <p className="victory">Congrats. You won!</p>}
      {tenzies && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </main>
  );
}

export default App