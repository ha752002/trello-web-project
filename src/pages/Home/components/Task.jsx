import React from 'react';
import {Draggable} from "react-beautiful-dnd";
import {EditText} from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import clsx from "clsx";
import Styles from "./Column.module.scss";

function Task({task, index, onSave, removeTask}) {

    return (<Draggable draggableId={task._id}
                       index={index}>
        {(provided) =>
            (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div >
                        <EditText  className={clsx(Styles.input_task)} defaultValue={task.content}  onSave={onSave}/>
                    </div>
                    <div onClick={()=>{
                        removeTask()
                    }}>
                        <i className={clsx('fa', 'fa-solid', 'fa-trash')}></i>
                    </div>
                </li>
            )}
    </Draggable>);
}

export default Task;