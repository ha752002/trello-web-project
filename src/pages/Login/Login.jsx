import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import Styles from './Login.module.scss/';
import clsx from 'clsx';
import {useDispatch, useSelector} from "react-redux";
import {authLogin} from "../../redux/slice/authSlice.js";
import {FormProvider, useForm} from "react-hook-form";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {customToast} from "../../utils/toastUtil.js";

const {turnOn, turnOff} = loadingSlice.actions;

function Login({toggleLoading}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm({
        criteriaMode: "all"
    });
    const {error, status, userInfo} = useSelector(state => state.auth)
    useEffect(() => {
        status === PENDING ? dispatch(turnOn()) : dispatch(turnOff());
    }, [status]);
    useEffect(() => {
        if (userInfo.apiKey) {
            customToast("Đăng nhập thành công")
            navigate("/home")
        } else if (error) {
            customToast(error.message)
        }
    }, [userInfo, error]);
    const onSubmit = (data) => {
        dispatch(authLogin(data))
    }
    return (
        <>
            <div className={clsx(Styles.form_login)}>
                <form onSubmit={handleSubmit(onSubmit)} className={clsx(Styles.form_login_wrapper)}>
                    <input
                        {...register("email")}
                        type="text"
                        placeholder="Vui lòng nhập Email"
                        className={clsx(Styles.form_login_input)}
                    />
                    <button type="submit" className={clsx(Styles.btn_submit)}>
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;
