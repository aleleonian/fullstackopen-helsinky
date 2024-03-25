import React from "react";
import { useSelector, useDispatch } from 'react-redux'

const generateAverage = (good, neutral, bad) => {
  if (good === 0 && bad === 0 && neutral === 0) return 0;
  return (good * 1 + 0 + bad * -1) / (good + neutral + bad);
};
const generatePositive = (good, neutral, bad) => {
  if (good === 0 && bad === 0 && neutral === 0) return 0;
  return (good / (good + neutral + bad)) * 100;
};

const Button = ({ title, onClickHandler }) => {
  return <button onClick={onClickHandler}>{title}</button>;
};

const StatisticLine = ({ title, value }) => {
  return (
    <React.Fragment>
      <td>{title}:</td>
      <td>{value}</td>
    </React.Fragment>
  );
};
const Statistics = ({ good, neutral, bad }) => {
  return (
    <React.Fragment>
      {good > 0 || neutral > 0 || bad > 0 ? (
        <React.Fragment>
          <table>
            <thead>
              <tr>
                <td>
                  <h1> Statistics </h1>
                </td>
              </tr>
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
                <StatisticLine
                  title={"Average"}
                  value={generateAverage(good, neutral, bad)}
                />
              </tr>
              <tr>
                <StatisticLine
                  title={"Positive"}
                  value={generatePositive(good, neutral, bad)}
                />
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ) : (
        "No feedback given"
      )}
    </React.Fragment>
  );
};

const App = () => {
  const dispatch = useDispatch()
  const appState = useSelector(state => state)

  const good = appState.good;
  const neutral = appState.neutral;
  const bad = appState.bad;

  const goodClickHandler = () => {
    dispatch({ type: "GOOD" });
  };
  const neutralClickHandler = () => {
    dispatch({ type: "NEUTRAL" });
  };
  const badClickHandler = () => {
    dispatch({ type: "BAD" });
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button title="good" onClickHandler={goodClickHandler} />
      <Button title="neutral" onClickHandler={neutralClickHandler} />
      <Button title="bad" onClickHandler={badClickHandler} />
      <br />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;