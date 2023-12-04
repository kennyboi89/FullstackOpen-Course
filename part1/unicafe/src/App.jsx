import { useState } from "react";

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        {props.value} {props.sign}
      </td>
    </tr>
  );
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const Statistics = (props) => {
  if (props.stats.all() == 0) {
    return <p>No feedback given.</p>;
  }

  return (
    <div>
      <h1>{props.stats.stat}</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.stats.good} />
          <StatisticLine text="neutral" value={props.stats.neutral} />
          <StatisticLine text="bad" value={props.stats.bad} />
          <StatisticLine text="all" value={props.stats.all()} />
          <StatisticLine text="average" value={props.stats.avg()} />
          <StatisticLine
            text="positive"
            value={props.stats.positive()}
            sign={"%"}
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const feedback = "give feedback";
  const stat = "statistics";

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  
  const stats = {
    stat: stat,
    good: good,
    neutral: neutral,
    bad: bad,
    all: function () {
      return this.good + this.bad + this.neutral;
    },
    avg: function () {
      return (-this.bad + this.good) / this.all();
    },
    positive: function () {
      return (this.good / this.all()) * 100;
    },
  };

  return (
    <div>
      <h1>{feedback}</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics stats={stats} />
    </div>
  );
};

export default App;
