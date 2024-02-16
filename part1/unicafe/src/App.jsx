import { useState } from 'react'

const Button = ({ title, onClickHandler }) => {
  return (
    <button onClick={onClickHandler}>{title}</button>
  )
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // const clickHandler = (counter, counterFunction) => {
  //   let newCounter = counter + 1;
  //   counterFunction(newCounter);
  // }

  const goodClickHandler = () => {
    let goodCounter = good;
    setGood(goodCounter + 1);
  }
  const neutralClickHandler = () => {
    let neutralCounter = neutral;
    setNeutral(neutralCounter + 1);
  }
  const badClickHandler = () => {
    let badCounter = bad;
    setBad(badCounter + 1);
  }

  const generateAverage = (good, bad, neutral) => {
    if (good === 0 && bad === 0 && neutral === 0) return 0;
    return ((good * 1) + (neutral * 0) + (bad * -1)) / (good + neutral + bad)
  }
  const generatePositive = (good, bad, neutral) => {
    if (good === 0 && bad === 0 && neutral === 0) return 0;
    return ((good + neutral) / (good + neutral + bad)) * 100;
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button title="good" onClickHandler={goodClickHandler} />
      <Button title="neutral" onClickHandler={neutralClickHandler} />
      <Button title="bad" onClickHandler={badClickHandler} />
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
      <div>
        Total: {good + neutral + bad}
      </div>
      <br />
      <div>
        Average: {generateAverage(good, neutral, bad)}
      </div>
      <br />
      <div>
        Positive: {generatePositive(good, neutral, bad)}%
      </div>
    </div>
  )
}

export default App