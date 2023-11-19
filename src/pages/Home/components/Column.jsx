import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";
import clsx from "clsx";
import Styles from "./Column.module.scss"
import trashIcon from "../../../assets/images/trash.svg";

function Column({column, index}) {
    return (<>
        <Draggable draggableId={column.column} index={index}>
            {(provided) => (<div className={clsx(Styles.column_wrapper)} key={column.column}
                                 ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                <div className={clsx(Styles.column_title)}>{column.column}
                    <i className={clsx(Styles.trash_icon, 'fa', 'fa-solid', 'fa-trash')}></i>
                </div>
                <Droppable droppableId={column.column} type="task">
                    {(provided) => (
                        <ul className={clsx(Styles.characters)}  {...provided.droppableProps}
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