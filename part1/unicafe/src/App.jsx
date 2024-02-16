import { useState } from 'react'

const Button = ({ title, onClickHandler, counter, counterFunction }) => {
  return (
    <button onClick={() => onClickHandler(counter, counterFunction)}>{title}</button>
  )
};

const clickHandler = (counter, counterFunction) => {
  let newCounter = counter + 1;
  counterFunction(newCounter);
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button title="good" counter={good} counterFunction={setGood} onClickHandler={clickHandler} />
      <Button title="neutral" counter={bad} counterFunction={setNeutral} onClickHandler={clickHandler} />
      <Button title="bad" counter={neutral} counterFunction={setBad} onClickHandler={clickHandler} />
      <br />
      <h1> Statistics </h1>
      <div>
        Good: {good}
      </div>
      <br />
      <div>
        Neutral: {neutral}
      </div>
      <br />
      <div>
        Bad: {bad}
      </div>
      <br />
    </div>
  )
}

export default App