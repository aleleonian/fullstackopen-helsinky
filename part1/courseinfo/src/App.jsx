const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const Header = () => <h1>{course}</h1>;

  const Part = function ({ name, exercises }) {
    return (
      <>
        <p>
          {name} {exercises}
        </p>
      </>
    )
  }

  const Content = () => {
    return (
      <>
        <Part name={part1} exercises={exercises1} />
        <Part name={part2} exercises={exercises2} />
        <Part name={part3} exercises={exercises3} />
      </>
    )
  }
  
  const Total = ({ totalExercises }) => <p>Number of exercises {totalExercises}</p>;

  return (

    <div>
      <Header />
      <Content />
      <Total totalExercises={exercises1 + exercises2 + exercises3} />
    </div>
  )

}

export default App