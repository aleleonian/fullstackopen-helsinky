const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
      {
        name: "Pelotas de mahoma",
        exercises: 14,
      },
    ],
  };
  return <Course course={course} />;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = function ({ name, exercises }) {
  return (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

const Total = ({ parts }) => {
  debugger;
  const totalExercises = parts.reduce(
    (accumulator, part) => accumulator + part.exercises,
    0
  );

  return <p>Number of exercises {totalExercises}</p>;
};
export default App;
