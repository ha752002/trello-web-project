import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";
import clsx from "clsx";
import Styles from "./Column.module.scss"
import trashIcon from "../../../assets/images/trash.svg";
import {useDispatch} from "react-redux";
import {taskSlice} from "../../../redux/slice/taskSlice.js";

function Column({column, index}) {
    const dispatch = useDispatch();
    const {addTask, removeColumn} = taskSlice.actions;

    return (<>
        <Draggable draggableId={column.column} index={index}>
            {(provided) => (<div className={clsx(Styles.column_wrapper)} key={column.column}
                                 ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                <div className={clsx(Styles.column_title)}>
                    <p contentEditable="true">{column.columnName}</p>
                    <p onClick={() => {
                        dispatch(removeColumn(index))
                    }}><i className={clsx(Styles.trash_icon, 'fa', 'fa-solid', 'fa-trash')}></i></p>
                </div>
                <Droppable droppableId={column.column} type="task">
                    {(provided) => (
                        <>
                            <ul className={clsx(Styles.characters)}  {...provided.droppableProps}
                                ref={provided.innerRef}>
                                {column.tasks && column.tasks.map((task, index) => {
                                    return <Task task={task} index={index} key={task._id}></Task>
                                })}
                                {provided.placeholder}
                            </ul>
                            <button onClick={() => {
                                dispatch(addTask(column))
                            }} className={clsx(Styles.button_add_task)}><i className="fa-solid fa-plus"></i> Add
                                Task
                            </button>
                        </>

                    )}
                </Droppable>
            </div>)}
        </Draggable>
    </>);
}

export default Column;