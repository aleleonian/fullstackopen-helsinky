const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };



  const Header = ({ course }) => <h1>{course.name}</h1>;

  const Part = function ({ name, exercises }) {
    return (
      <>
        <p>
          {name} {exercises}
        </p>
      </>
    )
  }

  const Content = ({ parts }) => {
    return (
      <>
        <Part name={parts[0].name} exercises={parts[0].exercises} />
        <Part name={parts[1].name} exercises={parts[1].exercises} />
        <Part name={parts[2].name} exercises={parts[2].exercises} />
      </>
    )
  }

  const Total = ({ parts }) => {

    let totalExercises = 0;

    parts.forEach(part => {
      totalExercises += part.exercises;
    });

    return (
      <p>Number of exercises {totalExercises}</p>
    )
  };

  return (

    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )

}

export default App