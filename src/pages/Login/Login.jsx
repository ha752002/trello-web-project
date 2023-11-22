import React, {useState, useEffect, useReducer} from 'react';
import {useNavigate} from 'react-router-dom';
import Styles from './Login.module.scss/';
import clsx from 'clsx';
import {useDispatch, useSelector} from "react-redux";
import {authLogin, authSlice} from "../../redux/slice/authSlice.js";
import {useForm} from "react-hook-form";
import {PENDING} from "../../constant/apiStatus.js";
import {loadingSlice} from "../../redux/slice/loadingSlice.js";
import {customToast} from "../../utils/toastUtil.js";
import {object, string} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

const {turnOn, turnOff} = loadingSlice.actions;
const {reset: loginReset} = authSlice.actions

export const signUpFormSchema = object({
    email: string().email().required(),
});

function Login({toggleLoading}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(signUpFormSchema),
        criteriaMode: "all"
    });
    const {error, status, userInfo} = useSelector(state => state.auth)
    useEffect(() => {
        status === PENDING ? dispatch(turnOn()) : dispatch(turnOff());
    }, [status]);

    useEffect(() => {
        if (userInfo && userInfo.apiKey) {
            customToast("Đăng nhập thành công")
            dispatch(loginReset());
            navigate("/home")
        }
    }, [userInfo]);


    const onSubmit = (data) => {
        dispatch(authLogin(data))
    }
    return (
        <>
            <div className={clsx(Styles.form_login)}>
                <div className={clsx(Styles.overlay)}></div>
                <form onSubmit={handleSubmit(onSubmit)} className={clsx(Styles.form_login_wrapper)}>
                    <input
                        {...register("email")}
                        type="text"
                        placeholder="Vui lòng nhập Email"
                        className={clsx(Styles.form_login_input)}
                    />
                    {errors.email && <p className={clsx(Styles.form_login_validate)}>{errors.email.message}</p>}
                    <button type="submit" className={clsx(Styles.btn_submit)}>
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;
