import { useState } from 'react'
import { clsx } from 'clsx';
import './App.css'
import { languages } from './services/languages'
import { getFarewellText, getRandomWord } from './services/service';
import Confetti from 'react-confetti';

function App() {
  // state variables
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // derived variables
  const wrongGuessCount = guessedLetters.filter(letter=>
    !currentWord.includes(letter)).length;
  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = 
    wrongGuessCount >= (languages.length - 1);
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  
  // static variables
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetters(letter){
    setGuessedLetters((prevLetters)=>
      prevLetters.includes(letter) ? 
      prevLetters : [...prevLetters, letter]
    )
  }

  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languageElements = languages.map((lang, i) => {
    const isLanguageLost = i < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span
        key={lang.name}
        className={`chip ${isLanguageLost? "lost": ""}`}
        style={styles}>
        {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split('').map((letter, i) => {  //change string to array to use map
    const revealLetter =  isGameLost || guessedLetters.includes(letter);

    const className = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    
    return(
    <span key={i} className={className}>
      {revealLetter ? letter.toUpperCase() : " "}
    </span>
  )
  })

  const keyboardElements = alphabet.split('').map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    }) 

    return(
      <button key={letter}
      className={className}
      disabled={isGameOver}
      onClick={() => addGuessedLetters(letter)}>
        {letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: isLastGuessIncorrect
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect){
      return(
      <p className='farewell-message'>
        {getFarewellText(languages[wrongGuessCount-1].name)}
      </p>
    )
    }else if(isGameWon){
      return(
        <>
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
        </>
      )
    }else if(isGameLost){
      return(
        <>
        <h2>you Lost</h2>
        <p>Better start learning Assembly 😭</p>
        </>
      )
    }else{
      return null
    }
  }

  return (
    <main>
      {
        isGameWon && <Confetti recycle={false} numberOfPieces={1000} />
      }
      <header>
        <h1>Assembly: endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming world
          safe from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className='language-chips'>
        {languageElements}
      </section>
      <section className='word'>
        {letterElements}
      </section>
      <section className='keyboard'>
        {keyboardElements}
      </section>
      {isGameOver ?
        <button className="new-game"
        onClick={startNewGame}>
          New Game
        </button>: null}
    </main>
  )
}

export default App
