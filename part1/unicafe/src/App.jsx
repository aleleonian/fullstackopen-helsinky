import React from 'react';
import { useState } from 'react'

const generateAverage = (good, bad, neutral) => {
  if (good === 0 && bad === 0 && neutral === 0) return 0;
  return ((good * 1) + (neutral * 0) + (bad * -1)) / (good + neutral + bad)
}
const generatePositive = (good, bad, neutral) => {
  if (good === 0 && bad === 0 && neutral === 0) return 0;
  return ((good + neutral) / (good + neutral + bad)) * 100;
}

const Button = ({ title, onClickHandler }) => {
  return (
    <button onClick={onClickHandler}>{title}</button>
  )
};

const StatisticLine = ({ title, value }) => {
  return (
    <React.Fragment>
      <td>
        {title}:
      </td>
      <td>
        {value}
      </td>
    </React.Fragment>
  )
}
const Statistics = ({ good, neutral, bad }) => {
  return (
    <React.Fragment>
      {good > 0 || neutral > 0 || bad > 0 ?
        <React.Fragment>

          <table>
            <thead>
              <tr><td><h1> Statistics </h1></td></tr>
            </thead>
            <tbody>
              <tr>
                <StatisticLine title={"Good"} value={good} />
              </tr>
              <tr>
                <StatisticLine title={"Neutral"} value={neutral} />
              </tr>
              <tr>
                <StatisticLine title={"Bad"} value={bad} />
              </tr>
              <tr>
                <StatisticLine title={"Total"} value={good + neutral + bad} />
              </tr>
              <tr>
                <StatisticLine title={"Average"} value={generateAverage(good, neutral, bad)} />
              </tr>
              <tr>
                <StatisticLine title={"Positive"} value={generatePositive(good, neutral, bad)} />
              </tr>
            </tbody>
          </table>
        </React.Fragment>
        :
        "No feedback given"}
    </React.Fragment>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

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

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button title="good" onClickHandler={goodClickHandler} />
      <Button title="neutral" onClickHandler={neutralClickHandler} />
      <Button title="bad" onClickHandler={badClickHandler} />
      <br />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App