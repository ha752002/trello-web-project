import React from 'react';
import {Draggable, Droppable} from "react-beautiful-dnd";
import Task from "./Task.jsx";
import clsx from "clsx";
import Styles from "./Column.module.scss"
import {useDispatch} from "react-redux";
import {taskSlice} from "../../../redux/slice/taskSlice.js";
import {EditText} from 'react-edit-text';
import 'react-edit-text/dist/index.css';

function Column({column, columnIndex}) {
    const dispatch = useDispatch();
    const {addTask, removeTask, removeColumn, editTitleColumn, editContentTask} = taskSlice.actions;

    const handleEditTitleColumn = (e) => {
        const {name: id, value, previousValue} = e;
        if (value !== previousValue) {
            dispatch(editTitleColumn({id, value}))
        }
    }

    const handleEditTitleTask = (e, index, columnIndex) => {
        const {name: id, value, previousValue} = e;
        if (value !== previousValue) {
            dispatch(editContentTask({
                value, index, columnIndex
            }))
        }
    }

    const handleRemoveTask = (index, columnIndex) => {
        dispatch(removeTask({index, columnIndex}))
    }

    return (<>
        <Draggable draggableId={column.column} index={columnIndex}>
            {(provided) =>
                (<div>
                    <div key={column.column}
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         className={clsx(Styles.column_wrapper)}>
                        <div className={clsx(Styles.column_title)}>

                            <div>
                                <EditText name={column.column} defaultValue={column.columnName}
                                          onSave={handleEditTitleColumn}/>
                            </div>
                            <div onClick={() => {
                                dispatch(removeColumn(columnIndex))
                            }}>
                                <i className={clsx(Styles.trash_icon, 'fa', 'fa-solid', 'fa-trash')}></i>
                            </div>

                        </div>
                        <Droppable droppableId={column.column} type="task">
                            {(provided) => (
                                <>
                                    <ul className={clsx(Styles.characters)}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}>
                                        {column.tasks && column.tasks.map((task, index) => {
                                            return <Task task={task} index={index} key={task._id}
                                                         removeTask={() => {
                                                             handleRemoveTask(index, columnIndex)
                                                         }}
                                                         onSave={(e) => {
                                                             handleEditTitleTask(e, index, columnIndex)
                                                         }}
                                            ></Task>
                                        })}
                                        {provided.placeholder}
                                    </ul>
                                    <button onClick={() => {
                                        dispatch(addTask(column))
                                    }} className={clsx(Styles.button_add_task)}>
                                        <i className="fa-solid fa-plus"></i> Add Task
                                    </button>
                                </>

                            )}
                        </Droppable>
                    </div>
                </div>)}
        </Draggable>
    </>);
}

export default Column;