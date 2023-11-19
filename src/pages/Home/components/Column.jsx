import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";

function Column({column, index}) {
    return (<>
        <Draggable draggableId={column.column} index={index}>
            {(provided) => (<div className="column__wrapper" key={column.column} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <p>{column.column}</p>
                <Droppable droppableId={column.column} type="task">
                    {(provided) => (
                        <ul className="characters" {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {column.tasks && column.tasks.map((task, index) => {
                                return <Task task={task} index={index} key={task._id}></Task>
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </div>)}
        </Draggable>
    </>);
}

export default Column;