import Header from "./header";
import Content from "./content";
import Total from "./total";

const Course = ({course}) => {
    return (
        <div>
            <Header title={course.name} />
            <Content parts={course.parts}/>
            <Total total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}/>
        </div>
    );
}

export default Course;