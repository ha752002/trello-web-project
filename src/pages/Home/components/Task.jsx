import React from 'react';
import {Draggable} from "react-beautiful-dnd";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

function Task({task, index, onSave}) {

    return (<Draggable draggableId={task._id}
                       index={index}>
        {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div>
                <EditText defaultValue={task.content} onSave={onSave}  />
            </div>
        </li>)}
    </Draggable>);
}

export default Task;