import React, {useEffect, useState} from 'react';
import Login from "../Login/Login.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTask, taskSlice} from "../../redux/slice/taskSlice.js";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {useNavigate} from "react-router-dom";
import {removeLocalStorage} from "../../utils/localStorage.js";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const {turnOn, turnOff} = loadingSlice.actions;
const {reset: taskReset} = taskSlice.actions;
import "./Home.css"

const finalSpaceCharacters = [
    {
        id: 'gary',
        name: 'Gary Goodspeed',
    },
    {
        id: 'cato',
        name: 'Little Cato',
    },
    {
        id: 'kvn',
        name: 'KVN',
    },
    {
        id: 'mooncake',
        name: 'Mooncake',
    },
    {
        id: 'quinn',
        name: 'Quinn Ergon',
    }
]

function Home(props) {
    const dispatch = useDispatch();
    const {data, error, status} = useSelector(state => state.task)
    const navigate = useNavigate();
    const [characters, updateCharacters] = useState(finalSpaceCharacters);

    useEffect(() => {
        dispatch(fetchTask());
        console.log(data)

        const tasksByColumn = {};
        data.columns.forEach(column => {                                                                                                                                                                    //////////////////////;lkjl;
            const columnName = column.column;
            tasksByColumn[columnName] = [];
        });

        data.tasks.forEach(task => {
            const column = task.column;
            tasksByColumn[column] = [...tasksByColumn[column], task];
        });

    }, [dispatch])

    useEffect(() => {
        status === PENDING ? dispatch(turnOn()) : dispatch(turnOff());
    }, [status]);

    useEffect(() => {
        if (error && error.code === 401) {
            removeLocalStorage('apiKey', 'taskData')
            navigate('/login')
            dispatch(taskReset());
        }
    }, [error]);

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(characters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateCharacters(items);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Final Space Characters</h1>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="characters">
                         {(provided) => (
                            <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                {characters.map(({id, name, thumb}, index) => {
                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {/*<div className="characters-thumb">*/}
                                                    {/*    <img src={thumb} alt={`${name} Thumb`}/>*/}
                                                    {/*</div>*/}
                                                    <p>
                                                        {name}
                                                    </p>
                                                </li>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </header>
            <p>
                Images from <a href="https://final-space.fandom.com/wiki/Final_Space_Wiki">Final Space Wiki</a>
            </p>
        </div>
    );
}

export default Home;