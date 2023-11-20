import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchTask, initTask, taskSlice, updateTask} from "../../redux/slice/taskSlice.js";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {useNavigate} from "react-router-dom";
import {getLocalStorage, removeLocalStorage} from "../../utils/localStorage.js";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Styles from "./Home.module.scss" ;
import Column from "./components/Column.jsx";
import clsx from "clsx";
import {authSlice} from "../../redux/slice/authSlice.js";
import {containUnicodeCharacter} from "../../utils/stringUtil.js";

const {turnOn, turnOff} = loadingSlice.actions;
const {reset: taskReset, reorderTask, reorderColumn, addColumn, removeTask} = taskSlice.actions;
const {reset: loginReset} = authSlice.actions

function Home(props) {
    const dispatch = useDispatch();
    const {data, error, status, success} = useSelector(state => state.task)
    const navigate = useNavigate();

    const logout = () => {
        removeLocalStorage('apiKey', 'taskData')
        dispatch(taskReset());
        dispatch(loginReset());
        navigate('/login')
    }

    useEffect(() => {
        const apiKey = getLocalStorage("apiKey")
        if (!apiKey || containUnicodeCharacter(apiKey)) {
            logout()
        }
    }, [])

    useEffect(() => {
        dispatch(fetchTask());
    }, [dispatch])

    useEffect(() => {
        status === PENDING ? dispatch(turnOn()) : dispatch(turnOff());
        // console.log(data)
    }, [status]);

    useEffect(() => {
        if (error && error.code === 401) {
            console.log(error)
            logout()
        }
    }, [error]);

    useEffect(() => {
        if (success && data && data.length === 0) {
            const taskList = [{
                "column": "doing", "content": "Get Money", "columnName": "Doing"
            }, {
                "column": "done", "content": "Eating in Home", "columnName": "Done"
            }, {
                "column": "todo", "content": "Loading....", "columnName": "Todo"
            }]
            dispatch(initTask(taskList))
        }
    }, [success]);

    function handleOnDragEnd(result) {
        // console.log(result)
        if (!result.destination || (result.source.index === result.destination.index && result.source.droppableId === result.destination.droppableId)) {
            return;
        }
        if (result.type === 'column') {
            dispatch(reorderColumn(result))
        } else if (result.type) {
            dispatch(reorderTask(result))
        }
    }

    return (<>
            <div className={clsx(Styles.home)}>
                <div className={clsx(Styles.overlay)}></div>
                <h1>Trello</h1>
                <header className={clsx(Styles.home_header)}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        {data && <Droppable droppableId="all-columns" direction="horizontal" type="column">
                            {(provided) =>
                                <>
                                     <div {...provided.droppableProps} ref={provided.innerRef}
                                     className={clsx(Styles.column_group)}>
                                    {data.length > 0 && data.map((column, index) => {
                                        return <Column column={column} index={index} key={column.column}></Column>
                                    })}
                                    {provided.placeholder}
                                     </div>
                                <button onClick={() => dispatch(addColumn())} className={clsx(Styles.button_add_column)}>  <i className="fa-solid fa-plus"></i> Add Column</button>
                            </>
                            }
                        </Droppable>}
                    </DragDropContext>

                </header>
            </div>
        </>

    );
}

export default Home;