import React, {useEffect} from 'react';
import Login from "../Login/Login.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTask, taskSlice} from "../../redux/slice/taskSlice.js";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {useNavigate} from "react-router-dom";
import {removeLocalStorage} from "../../utils/localStorage.js";

const {turnOn, turnOff} = loadingSlice.actions;
const {reset: taskReset} = taskSlice.actions;
function Home(props) {
    const dispatch = useDispatch();
    const {data, error, status} = useSelector(state => state.task)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchTask());
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

    return <>
        <div>Home</div>
    </>
}

export default Home;