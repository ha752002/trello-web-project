import React, {useEffect, useState} from 'react';
import Login from "../Login/Login.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTask, taskSlice, updateTask} from "../../redux/slice/taskSlice.js";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {useNavigate} from "react-router-dom";
import {removeLocalStorage} from "../../utils/localStorage.js";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import "./Home.css"

const {turnOn, turnOff} = loadingSlice.actions;
const {reset: taskReset, changeColumn} = taskSlice.actions;

function Home(props) {
    const dispatch = useDispatch();
    const {data, error, status, success} = useSelector(state => state.task)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchTask());
    }, [dispatch])

    useEffect(() => {
        status === PENDING ? dispatch(turnOn()) : dispatch(turnOff());
        // console.log(data)
    }, [status]);

    useEffect(() => {
        if (error && error.code === 401) {
            removeLocalStorage('apiKey', 'taskData')
            dispatch(taskReset());
            navigate('/login')
        }
    }, [error]);

    useEffect(() => {
        if (success && data && data.length === 0) {
            const taskList = [
                {
                    "column": "doing",
                    "content": "Get Money",
                    "columnName": "Doing"
                },
                {
                    "column": "done",
                    "content": "Eating in Home",
                    "columnName": "Done"
                },
                {
                    "column": "todo",
                    "content": "Loading....",
                    "columnName": "Todo"
                }
            ]
            dispatch(updateTask(taskList))
        }
    }, [success]);

    function handleOnDragEnd(result) {
        console.log(result)
        if (!result.destination || (result.source.index === result.destination.index && result.source.droppableId === result.destination.droppableId)) {
            return;
        }
        dispatch(changeColumn(result))
    }

    return (
        <>
            <div className="App">
                <div className="overlay"></div>
                <h1>Trello</h1>
                <header className="App-header">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        {data && data.length > 0 && data.map((column, index) => {
                            return (<div className="column__wrapper" key={column.column} >
                                <p>{column.column}</p>
                                <Droppable droppableId={column.column}>
                                    {(provided) => (
                                        <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                            {column.tasks && column.tasks.map((task, index) => {
                                                return (<Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <p>
                                                                {task.content}
                                                            </p>
                                                        </li>)}
                                                </Draggable>)
                                            })}
                                            {provided.placeholder}
                                        </ul>

                                    )}

                                </Droppable>
                            </div>)
                        })}
                    </DragDropContext>
                </header>

            </div>
        </>

    );
}

export default Home;
