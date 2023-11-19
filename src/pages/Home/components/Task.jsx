import React from 'react';
import {Draggable} from "react-beautiful-dnd";

function Task({task, index}) {
    return (<Draggable draggableId={task._id}
                       index={index}>
        {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <p>
                {task.content}
            </p>
        </li>)}
    </Draggable>);
}

export default Task;